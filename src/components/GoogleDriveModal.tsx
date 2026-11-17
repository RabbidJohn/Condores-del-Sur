import { User } from 'firebase/auth';
import {
  Cloud,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  HardDrive,
  LogOut,
  Pencil,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getAircraftSpec } from '../game/aircraft';
import { HudSnapshot } from '../game/types';
import { getAccessToken } from '../services/googleAuth';
import {
  CAMPAIGN_SAVE_FILENAME,
  CampaignSavePayload,
  deleteDriveFile,
  downloadCampaignSave,
  downloadDriveFileText,
  DriveAuthExpiredError,
  DriveFileItem,
  exportFlightLogToDrive,
  findCampaignSaveFile,
  listDriveFiles,
  renameDriveFile,
  saveCampaignToDrive,
  trashDriveFile,
} from '../services/googleDrive';
import { GoogleSignInButton } from './GoogleSignInButton';

interface GoogleDriveModalProps {
  open: boolean;
  onClose: () => void;
  hud: HudSnapshot;
  needsAuth: boolean;
  user: User | null;
  isLoggingIn: boolean;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
  onAuthExpired: () => void;
  onSyncHighScore: (remoteHighScore: number) => void;
  onLoadCampaign: (save: CampaignSavePayload) => void;
}

interface PendingConfirmation {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  execute: (token: string) => Promise<void>;
}

function formatBytes(sizeStr?: string): string {
  const bytes = Number(sizeStr);
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export function GoogleDriveModal({
  open,
  onClose,
  hud,
  needsAuth,
  user,
  isLoggingIn,
  onLogin,
  onLogout,
  onAuthExpired,
  onSyncHighScore,
  onLoadCampaign,
}: GoogleDriveModalProps) {
  const [activeTab, setActiveTab] = useState<'campaign' | 'files'>('campaign');
  const [loading, setLoading] = useState(false);
  const [busyMessage, setBusyMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [cloudSaveFile, setCloudSaveFile] = useState<DriveFileItem | null>(null);
  const [cloudSaveData, setCloudSaveData] = useState<CampaignSavePayload | null>(null);

  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState<{ name: string; content: string } | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ file: DriveFileItem; nextName: string } | null>(
    null
  );
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirmation | null>(null);

  const requireToken = useCallback(async (): Promise<string | null> => {
    const token = await getAccessToken();
    if (!token) {
      onAuthExpired();
      return null;
    }
    return token;
  }, [onAuthExpired]);

  const refreshCloudState = useCallback(
    async (queryOverride?: string) => {
      const token = await requireToken();
      if (!token) return;

      setLoading(true);
      setErrorMsg(null);
      try {
        const [saveItem, driveList] = await Promise.all([
          findCampaignSaveFile(token),
          listDriveFiles(token, queryOverride ?? searchQuery),
        ]);
        setCloudSaveFile(saveItem);
        setFiles(driveList);

        if (saveItem) {
          try {
            const payload = await downloadCampaignSave(token, saveItem.id);
            setCloudSaveData(payload);
            if (payload.highScore > hud.highScore) {
              onSyncHighScore(payload.highScore);
            }
          } catch {
            setCloudSaveData(null);
          }
        } else {
          setCloudSaveData(null);
        }
      } catch (err) {
        if (err instanceof DriveAuthExpiredError) {
          onAuthExpired();
        } else {
          setErrorMsg(err instanceof Error ? err.message : 'No se pudo consultar Google Drive.');
        }
      } finally {
        setLoading(false);
      }
    },
    [hud.highScore, onAuthExpired, onSyncHighScore, requireToken, searchQuery]
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        if (pendingConfirm) {
          setPendingConfirm(null);
        } else if (renameTarget) {
          setRenameTarget(null);
        } else if (previewFile) {
          setPreviewFile(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, pendingConfirm, previewFile, renameTarget]);

  useEffect(() => {
    if (open && !needsAuth) {
      void refreshCloudState();
    }
  }, [open, needsAuth, refreshCloudState]);

  if (!open) return null;

  const activeSpec = getAircraftSpec(hud.aircraftId);

  const buildCurrentPayload = (): CampaignSavePayload => ({
    version: 1,
    savedAt: new Date().toISOString(),
    pilotCallsign: activeSpec.callsign,
    aircraftId: hud.aircraftId,
    highScore: Math.max(hud.highScore, hud.score),
    score: hud.score,
    waveNumber: hud.waveNumber,
    enemiesDefeated: hud.enemiesDefeated,
    shipsSunk: hud.shipsSunk,
    lives: hud.lives,
    cannonLevel: hud.cannonLevel,
    bombs: hud.bombs,
    exocets: hud.exocets,
  });

  const runConfirmedAction = async () => {
    if (!pendingConfirm) return;
    const token = await requireToken();
    if (!token) {
      setPendingConfirm(null);
      return;
    }

    const action = pendingConfirm;
    setPendingConfirm(null);
    setBusyMessage('Sincronizando con Google Drive...');
    setErrorMsg(null);
    setStatusMsg(null);

    try {
      await action.execute(token);
      await refreshCloudState();
    } catch (err) {
      if (err instanceof DriveAuthExpiredError) {
        onAuthExpired();
      } else {
        setErrorMsg(err instanceof Error ? err.message : 'Error al ejecutar operación en Drive.');
      }
    } finally {
      setBusyMessage(null);
    }
  };

  const requestSaveCampaign = () => {
    const payload = buildCurrentPayload();
    const isOverwrite = Boolean(cloudSaveFile);
    setPendingConfirm({
      title: isOverwrite
        ? '¿Sobrescribir partida en Google Drive?'
        : '¿Guardar nueva partida en Google Drive?',
      description: isOverwrite
        ? `Se actualizará el archivo "${CAMPAIGN_SAVE_FILENAME}" con el Nivel ${payload.waveNumber}/20, ${activeSpec.name}, Puntaje ${payload.score} y Hi-Score ${payload.highScore}.`
        : `Se creará el archivo "${CAMPAIGN_SAVE_FILENAME}" en tu Google Drive con el Nivel ${payload.waveNumber}/20, ${activeSpec.name} y Hi-Score ${payload.highScore}.`,
      confirmLabel: isOverwrite ? 'Confirmar y sobrescribir' : 'Confirmar y guardar',
      execute: async (token) => {
        const saved = await saveCampaignToDrive(token, payload, cloudSaveFile?.id);
        setCloudSaveFile(saved);
        setCloudSaveData(payload);
        setStatusMsg(`Partida guardada en Google Drive (${saved.name}).`);
      },
    });
  };

  const requestExportFlightLog = () => {
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
    const fileName = `Bitacora_Condores_1982_${timestamp}.txt`;
    const logContent = [
      '======================================================',
      '  CÓNDORES DEL SUR 1982 — BITÁCORA DE VUELO TÁCTICA',
      '======================================================',
      `Fecha de registro: ${new Date().toLocaleString('es-AR')}`,
      `Piloto: ${activeSpec.pilot} (${activeSpec.callsign})`,
      `Aeronave: ${activeSpec.name} · ${activeSpec.squadron}`,
      `Base aérea: ${activeSpec.base}`,
      `Sector actual: Nivel ${hud.waveNumber}/${hud.totalWaves} — ${hud.sectorName}`,
      '------------------------------------------------------',
      `Puntaje de misión: ${hud.score}`,
      `Hi-Score histórico: ${Math.max(hud.highScore, hud.score)}`,
      `Aeronaves/Unidades abatidas: ${hud.enemiesDefeated}`,
      `Buques británicos hundidos: ${hud.shipsSunk}`,
      `Vidas restantes: ${hud.lives}`,
      `Armamento: Cañón Lv.${hud.cannonLevel} | Secundaria: ${hud.bombs} | Especial: ${hud.exocets}`,
      '======================================================',
    ].join('\n');

    setPendingConfirm({
      title: '¿Crear bitácora de vuelo en Google Drive?',
      description: `Se creará el archivo de texto "${fileName}" en tu unidad de Google Drive con el reporte actual de la campaña.`,
      confirmLabel: 'Confirmar y exportar',
      execute: async (token) => {
        const created = await exportFlightLogToDrive(token, fileName, logContent);
        setStatusMsg(`Bitácora exportada a Drive: ${created.name}`);
      },
    });
  };

  const handleLoadCloudCampaign = () => {
    if (!cloudSaveData) return;
    onSyncHighScore(cloudSaveData.highScore);
    onLoadCampaign(cloudSaveData);
    onClose();
  };

  const handlePreviewFile = async (file: DriveFileItem) => {
    const token = await requireToken();
    if (!token) return;
    setBusyMessage(`Leyendo ${file.name}...`);
    setErrorMsg(null);
    try {
      const content = await downloadDriveFileText(token, file.id);
      setPreviewFile({ name: file.name, content: content.slice(0, 12000) });
    } catch (err) {
      if (err instanceof DriveAuthExpiredError) {
        onAuthExpired();
      } else {
        setErrorMsg('No se pudo previsualizar este archivo (puede ser un formato binario o Google Doc nativo).');
      }
    } finally {
      setBusyMessage(null);
    }
  };

  const requestRenameConfirm = () => {
    if (!renameTarget) return;
    const trimmed = renameTarget.nextName.trim();
    if (!trimmed || trimmed === renameTarget.file.name) {
      setRenameTarget(null);
      return;
    }
    const targetFile = renameTarget.file;
    setRenameTarget(null);
    setPendingConfirm({
      title: '¿Renombrar archivo en Google Drive?',
      description: `El archivo "${targetFile.name}" pasará a llamarse "${trimmed}".`,
      confirmLabel: 'Confirmar cambio de nombre',
      execute: async (token) => {
        await renameDriveFile(token, targetFile.id, trimmed);
        setStatusMsg(`Archivo renombrado a "${trimmed}".`);
      },
    });
  };

  const requestTrashFile = (file: DriveFileItem) => {
    setPendingConfirm({
      title: '¿Mover archivo a la papelera de Drive?',
      description: `Se moverá "${file.name}" a la papelera de tu Google Drive.`,
      confirmLabel: 'Mover a papelera',
      danger: true,
      execute: async (token) => {
        await trashDriveFile(token, file.id);
        setStatusMsg(`"${file.name}" movido a la papelera.`);
      },
    });
  };

  const requestPermanentDelete = (file: DriveFileItem) => {
    setPendingConfirm({
      title: '¿Eliminar archivo permanentemente?',
      description: `Se eliminará "${file.name}" de forma definitiva de Google Drive. Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar definitivamente',
      danger: true,
      execute: async (token) => {
        await deleteDriveFile(token, file.id);
        setStatusMsg(`"${file.name}" eliminado de Google Drive.`);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03060D]/90 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col border-2 border-[#74ACDF] bg-[#070E1A] text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.95)]">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 bg-[#050A14] px-5 py-4">
          <div className="flex items-center gap-3">
            <HardDrive className="h-5 w-5 text-[#74ACDF]" />
            <div>
              <span className="font-arcade block text-[9px] text-[#F6B40E]">
                ARCHIVO EN LA NUBE
              </span>
              <h2 className="font-arcade mt-0.5 text-xs sm:text-sm text-white">
                GOOGLE DRIVE · BITÁCORA Y PARTIDAS
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de Google Drive"
            className="flex h-9 w-9 cursor-pointer items-center justify-center border border-slate-700 bg-[#0A1324] text-slate-300 transition-colors hover:border-[#74ACDF] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {needsAuth ? (
            <div className="flex flex-col items-center justify-center border border-slate-800 bg-[#040812] px-6 py-10 text-center">
              <Cloud className="mb-4 h-12 w-12 text-[#74ACDF]" />
              <h3 className="font-arcade text-xs sm:text-sm text-white">
                CONECTAR CON GOOGLE DRIVE
              </h3>
              <p className="mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-slate-300">
                Inicia sesión con tu cuenta de Google para guardar y reanudar tu campaña de 20 niveles,
                respaldar tu Hi-Score, exportar bitácoras de vuelo y explorar tus archivos en Google Drive.
              </p>

              <div className="mt-6">
                <GoogleSignInButton
                  onClick={() => void onLogin()}
                  disabled={isLoggingIn}
                  label={isLoggingIn ? 'Conectando...' : 'Sign in with Google'}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Account status bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-800 bg-[#040914] px-4 py-3">
                <div className="flex items-center gap-3">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName ?? 'Piloto'}
                      referrerPolicy="no-referrer"
                      className="h-9 w-9 border border-[#74ACDF] object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center border border-[#74ACDF] bg-[#0B1C34] text-xs font-bold text-[#74ACDF]">
                      {(user?.displayName ?? user?.email ?? 'G')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="text-xs">
                    <p className="font-semibold text-white">
                      {user?.displayName ?? 'Piloto conectado'}
                    </p>
                    <p className="text-slate-400">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void refreshCloudState()}
                    disabled={loading}
                    className="flex cursor-pointer items-center gap-1.5 border border-slate-700 bg-[#0A1324] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[#74ACDF] disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Actualizar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void onLogout()}
                    className="flex cursor-pointer items-center gap-1.5 border border-slate-700 bg-[#0A1324] px-3 py-1.5 text-xs font-semibold text-rose-300 hover:border-rose-400"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Salir</span>
                  </button>
                </div>
              </div>

              {/* Navigation tabs */}
              <div className="flex border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('campaign')}
                  className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                    activeTab === 'campaign'
                      ? 'border-[#F6B40E] text-[#F6B40E]'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Campaña y Bitácora</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('files')}
                  className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                    activeTab === 'files'
                      ? 'border-[#74ACDF] text-[#74ACDF]'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>Explorador de Drive ({files.length})</span>
                </button>
              </div>

              {errorMsg && (
                <div className="border border-rose-500/70 bg-rose-950/60 px-3.5 py-2.5 text-xs text-rose-200">
                  {errorMsg}
                </div>
              )}

              {statusMsg && (
                <div className="border border-emerald-500/70 bg-emerald-950/50 px-3.5 py-2.5 text-xs text-emerald-200">
                  {statusMsg}
                </div>
              )}

              {busyMessage && (
                <div className="border border-[#74ACDF]/60 bg-[#0B1B33] px-3.5 py-2.5 text-xs text-cyan-200">
                  {busyMessage}
                </div>
              )}

              {activeTab === 'campaign' ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Local Campaign Status */}
                  <div className="flex flex-col justify-between border border-slate-800 bg-[#040914] p-4">
                    <div>
                      <span className="font-arcade block text-[9px] text-[#74ACDF]">
                        ESTADO LOCAL ACTUAL
                      </span>
                      <div className="mt-3 space-y-2 text-xs text-slate-300">
                        <div className="flex justify-between border-b border-slate-800/80 pb-1">
                          <span className="text-slate-400">Aeronave</span>
                          <span className="font-semibold text-white">{activeSpec.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/80 pb-1">
                          <span className="text-slate-400">Nivel</span>
                          <span className="font-arcade text-[10px] text-[#74ACDF]">
                            {hud.waveNumber}/{hud.totalWaves}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/80 pb-1">
                          <span className="text-slate-400">Puntaje</span>
                          <span className="font-arcade text-[10px] text-[#F6B40E]">
                            {String(hud.score).padStart(7, '0')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Hi-Score Local</span>
                          <span className="font-arcade text-[10px] text-white">
                            {String(hud.highScore).padStart(7, '0')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={requestSaveCampaign}
                        disabled={Boolean(busyMessage)}
                        className="font-arcade flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-[#FDE047] bg-[#74ACDF] px-4 py-2.5 text-[10px] text-[#050A14] hover:bg-[#93C5FD] disabled:opacity-50"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>GUARDAR CAMPAÑA EN DRIVE</span>
                      </button>

                      <button
                        type="button"
                        onClick={requestExportFlightLog}
                        disabled={Boolean(busyMessage)}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 border border-slate-700 bg-[#0A1528] px-4 py-2 text-xs font-semibold text-slate-200 hover:border-[#74ACDF] disabled:opacity-50"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#F6B40E]" />
                        <span>Exportar Bitácora de Vuelo (.txt)</span>
                      </button>
                    </div>
                  </div>

                  {/* Cloud Save Status */}
                  <div className="flex flex-col justify-between border border-slate-800 bg-[#040914] p-4">
                    <div>
                      <span className="font-arcade block text-[9px] text-[#F6B40E]">
                        RESPALDO EN GOOGLE DRIVE
                      </span>
                      {cloudSaveFile && cloudSaveData ? (
                        <div className="mt-3 space-y-2 text-xs text-slate-300">
                          <div className="flex justify-between border-b border-slate-800/80 pb-1">
                            <span className="text-slate-400">Archivo</span>
                            <span className="truncate max-w-[160px] font-mono text-[11px] text-cyan-300">
                              {cloudSaveFile.name}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800/80 pb-1">
                            <span className="text-slate-400">Aeronave</span>
                            <span className="font-semibold text-white">
                              {getAircraftSpec(cloudSaveData.aircraftId).name}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800/80 pb-1">
                            <span className="text-slate-400">Nivel guardado</span>
                            <span className="font-arcade text-[10px] text-[#74ACDF]">
                              {cloudSaveData.waveNumber}/20
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800/80 pb-1">
                            <span className="text-slate-400">Hi-Score Drive</span>
                            <span className="font-arcade text-[10px] text-[#F6B40E]">
                              {String(cloudSaveData.highScore).padStart(7, '0')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Actualizado</span>
                            <span className="text-[11px] text-slate-300">
                              {formatDate(cloudSaveData.savedAt)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-4 text-xs leading-relaxed text-slate-400">
                          {loading
                            ? 'Buscando partida guardada en tu Google Drive...'
                            : `Todavía no hay ningún archivo "${CAMPAIGN_SAVE_FILENAME}" guardado en tu unidad.`}
                        </p>
                      )}
                    </div>

                    {cloudSaveData && (
                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={handleLoadCloudCampaign}
                          className="font-arcade flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-[#F6B40E] bg-[#0B1C34] px-4 py-2.5 text-[10px] text-[#FDE68A] hover:bg-[#132A4A]"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>REANUDAR DESDE NIVEL {cloudSaveData.waveNumber}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Search bar */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void refreshCloudState(searchQuery);
                    }}
                    className="flex gap-2"
                  >
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar archivos en Google Drive por nombre..."
                        className="w-full border border-slate-700 bg-[#040812] py-2 pr-3 pl-9 text-xs text-white placeholder:text-slate-500 focus:border-[#74ACDF] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer border border-[#74ACDF] bg-[#0B1C34] px-4 py-2 text-xs font-semibold text-[#74ACDF] hover:bg-[#132A4A]"
                    >
                      Buscar
                    </button>
                  </form>

                  {/* File list */}
                  <div className="max-h-72 overflow-y-auto border border-slate-800 bg-[#040812]">
                    {files.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        {loading ? 'Cargando archivos de Google Drive...' : 'No se encontraron archivos.'}
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-800/80">
                        {files.map((file) => {
                          const canPreview =
                            file.mimeType.startsWith('text/') ||
                            file.mimeType === 'application/json' ||
                            file.name.endsWith('.json') ||
                            file.name.endsWith('.txt') ||
                            file.name.endsWith('.md');

                          return (
                            <li
                              key={file.id}
                              className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 text-xs hover:bg-[#081224]"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-white">{file.name}</p>
                                <p className="mt-0.5 text-[11px] text-slate-400">
                                  {formatDate(file.modifiedTime)} · {formatBytes(file.size)}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {canPreview && (
                                  <button
                                    type="button"
                                    onClick={() => void handlePreviewFile(file)}
                                    className="cursor-pointer border border-slate-700 bg-[#0A1426] px-2.5 py-1 text-[11px] text-cyan-300 hover:border-[#74ACDF]"
                                  >
                                    Ver
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRenameTarget({ file, nextName: file.name })
                                  }
                                  title="Renombrar archivo"
                                  className="cursor-pointer border border-slate-700 bg-[#0A1426] p-1.5 text-slate-300 hover:border-[#F6B40E] hover:text-[#F6B40E]"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => requestTrashFile(file)}
                                  title="Mover a papelera"
                                  className="cursor-pointer border border-slate-700 bg-[#0A1426] p-1.5 text-amber-300 hover:border-amber-400"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => requestPermanentDelete(file)}
                                  title="Eliminar definitivamente"
                                  className="cursor-pointer border border-slate-700 bg-[#0A1426] px-2 py-1 text-[11px] text-rose-300 hover:border-rose-500"
                                >
                                  Borrar
                                </button>
                                {file.webViewLink && (
                                  <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Abrir en Google Drive"
                                    className="border border-slate-700 bg-[#0A1426] p-1.5 text-slate-300 hover:border-[#74ACDF] hover:text-white"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* File Preview Sub-Modal */}
        {previewFile && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#03060D]/90 p-5">
            <div className="flex max-h-[80vh] w-full max-w-xl flex-col border-2 border-[#74ACDF] bg-[#060D1A] p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="truncate font-mono text-xs font-bold text-[#74ACDF]">
                  {previewFile.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="cursor-pointer border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
              <pre className="flex-1 overflow-auto bg-[#03060D] p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-200">
                {previewFile.content}
              </pre>
            </div>
          </div>
        )}

        {/* Rename Sub-Modal */}
        {renameTarget && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#03060D]/90 p-5">
            <div className="w-full max-w-md border-2 border-[#F6B40E] bg-[#070E1A] p-5 shadow-2xl">
              <h3 className="font-arcade text-xs text-white">RENOMBRAR ARCHIVO</h3>
              <p className="mt-2 text-xs text-slate-400">
                Nuevo nombre para <span className="text-slate-200">{renameTarget.file.name}</span>:
              </p>
              <input
                type="text"
                value={renameTarget.nextName}
                onChange={(e) =>
                  setRenameTarget({ ...renameTarget, nextName: e.target.value })
                }
                className="mt-3 w-full border border-slate-700 bg-[#040812] px-3 py-2 text-xs text-white focus:border-[#F6B40E] focus:outline-none"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="cursor-pointer border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={requestRenameConfirm}
                  className="cursor-pointer border border-[#F6B40E] bg-[#F6B40E] px-4 py-1.5 text-xs font-bold text-[#050A14] hover:bg-amber-300"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Explicit User Confirmation Dialog for all Mutating / Destructive Operations */}
        {pendingConfirm && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#02050A]/92 p-5">
            <div
              className={`w-full max-w-md border-2 bg-[#070E1A] p-5 shadow-2xl ${
                pendingConfirm.danger ? 'border-rose-500' : 'border-[#F6B40E]'
              }`}
            >
              <h3 className="font-arcade text-xs leading-relaxed text-white">
                {pendingConfirm.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                {pendingConfirm.description}
              </p>
              <div className="mt-5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPendingConfirm(null)}
                  className="cursor-pointer border border-slate-700 bg-transparent px-4 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => void runConfirmedAction()}
                  className={`cursor-pointer px-4 py-2 text-xs font-bold ${
                    pendingConfirm.danger
                      ? 'border border-rose-400 bg-rose-600 text-white hover:bg-rose-500'
                      : 'border border-[#FDE047] bg-[#74ACDF] text-[#050A14] hover:bg-[#93C5FD]'
                  }`}
                >
                  {pendingConfirm.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
