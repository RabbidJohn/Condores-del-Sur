import { ArrowLeft, Music, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { AIRCRAFT_ROSTER, AircraftSpec, getAircraftSpec } from '../game/aircraft';
import { getSpriteBank } from '../game/pixelSprites';
import { AircraftId } from '../game/types';
import { CondorSkyhawkLogo } from './CondorSkyhawkLogo';

interface AircraftSelectScreenProps {
  selectedAircraft: AircraftId;
  muted: boolean;
  musicMuted: boolean;
  onSelectAircraft: (id: AircraftId) => void;
  onBack: () => void;
  onLaunchMission: () => void;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onUnlockMusic: () => void;
}

function SpritePreviewCanvas({ aircraftId }: { aircraftId: AircraftId }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const spr = getSpriteBank().playerSprites[aircraftId].center;
    canvas.width = spr.canvas.width;
    canvas.height = spr.canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(spr.canvas, 0, 0);
  }, [aircraftId]);

  return (
    <canvas
      ref={canvasRef}
      className="h-20 w-20 object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.85)]"
      aria-hidden="true"
    />
  );
}

function StatBlocks({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`h-2.5 w-3.5 ${n <= value ? color : 'bg-slate-800'}`}
        />
      ))}
    </div>
  );
}

export function AircraftSelectScreen({
  selectedAircraft,
  muted,
  musicMuted,
  onSelectAircraft,
  onBack,
  onLaunchMission,
  onToggleMute,
  onToggleMusic,
  onUnlockMusic,
}: AircraftSelectScreenProps) {
  const activeSpec: AircraftSpec = getAircraftSpec(selectedAircraft);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      onUnlockMusic();
      if (e.code === 'Escape') {
        e.preventDefault();
        onBack();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        const idx = AIRCRAFT_ROSTER.findIndex((a) => a.id === selectedAircraft);
        const next = AIRCRAFT_ROSTER[(idx + 1) % AIRCRAFT_ROSTER.length];
        onSelectAircraft(next.id);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        const idx = AIRCRAFT_ROSTER.findIndex((a) => a.id === selectedAircraft);
        const prev = AIRCRAFT_ROSTER[(idx - 1 + AIRCRAFT_ROSTER.length) % AIRCRAFT_ROSTER.length];
        onSelectAircraft(prev.id);
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onLaunchMission();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onBack, onLaunchMission, onSelectAircraft, onUnlockMusic, selectedAircraft]);

  return (
    <div className="relative h-full w-full overflow-y-auto bg-[#050912] select-none">
      {/* Subtle atmospheric backdrop keeping Sheffield silhouette softly behind */}
      <img
        src="/src/assets/images/sheffield_sinking_keyart_1794901418771.jpg"
        alt=""
        referrerPolicy="no-referrer"
        className="fixed inset-0 h-full w-full scale-[1.04] object-cover object-right opacity-25"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#040810]/92 via-[#060D1A]/88 to-[#040810]/96" />

      {/* Top Argentine Celeste-Blanco-Celeste Ribbon */}
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-20 flex h-1.5">
        <div className="h-full flex-1 bg-[#74ACDF]" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-[#74ACDF]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-full max-w-6xl flex-col justify-between px-6 py-6 sm:px-10">
        {/* Top Bar: Back + Condor Logo + Audio Controls */}
        <header className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 cursor-pointer items-center gap-2 border-2 border-slate-700 bg-[#08101E] px-3 text-xs font-semibold text-slate-200 transition-colors hover:border-[#74ACDF]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>VOLVER</span>
            </button>
            <CondorSkyhawkLogo className="hidden sm:block h-10 w-10 shrink-0" />
            <div>
              <span className="font-arcade block text-[9px] text-[#74ACDF]">
                CÓNDORES DEL SUR 1982
              </span>
              <h2 className="font-arcade mt-1 text-xs sm:text-sm text-white">
                SELECCIÓN DE PILOTO Y AERONAVE
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onUnlockMusic();
                onToggleMusic();
              }}
              className="flex h-9 cursor-pointer items-center gap-2 border-2 border-slate-700 bg-[#08101E] px-3 text-xs font-semibold text-slate-200 transition-colors hover:border-[#74ACDF]"
            >
              <Music className={`h-3.5 w-3.5 ${musicMuted ? 'text-slate-500' : 'text-[#74ACDF]'}`} />
              <span className="hidden sm:inline whitespace-nowrap">
                {musicMuted ? 'Música OFF' : 'El Visitante - Almafuerte ON'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                onUnlockMusic();
                onToggleMute();
              }}
              aria-label={muted ? 'Activar audio' : 'Silenciar audio'}
              className="flex h-9 w-9 cursor-pointer items-center justify-center border-2 border-slate-700 bg-[#08101E] text-slate-200 transition-colors hover:border-[#74ACDF]"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* 4 Aero Fighters Style Character & Plane Cards */}
        <section className="my-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {AIRCRAFT_ROSTER.map((spec, idx) => {
            const isSelected = spec.id === selectedAircraft;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => {
                  onUnlockMusic();
                  onSelectAircraft(spec.id);
                }}
                className={`flex cursor-pointer flex-col border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-[#F6B40E] bg-[#0B1A30] shadow-[0_0_24px_rgba(246,180,14,0.2)]'
                    : 'border-slate-800 bg-[#070E1A]/90 hover:border-[#74ACDF]'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-arcade text-[9px] text-slate-400">
                    PILOTO 0{idx + 1}
                  </span>
                  {isSelected && (
                    <span className="font-arcade bg-[#F6B40E] px-1.5 py-0.5 text-[8px] text-[#050A14]">
                      ACTIVO
                    </span>
                  )}
                </div>

                <div className="mb-3 flex w-full items-center justify-center border border-slate-800 bg-[#040812] py-4">
                  <SpritePreviewCanvas aircraftId={spec.id} />
                </div>

                <h3 className="font-arcade text-xs text-white">{spec.name}</h3>
                <p className="mt-1.5 text-sm font-bold text-[#74ACDF]">{spec.pilot}</p>
                <p className="text-xs text-slate-400">{spec.squadron}</p>
                <p className="mt-1 text-[11px] font-semibold text-amber-300/90">{spec.base}</p>
                <p className="mt-1 text-[11px] leading-snug text-slate-300">{spec.historicalAction}</p>

                <div className="mt-2.5 space-y-1 border-t border-slate-800 pt-2 text-[11px] text-slate-300">
                  <p className="truncate">
                    <span className="text-cyan-300 font-semibold">Cañón:</span> {spec.cannonLabel}
                  </p>
                  <p className="truncate">
                    <span className="text-[#F6B40E] font-semibold">Sec.:</span> {spec.bombLabel}
                  </p>
                  <p className="truncate">
                    <span className="text-[#74ACDF] font-semibold">Esp.:</span> {spec.specialLabel}
                  </p>
                </div>
              </button>
            );
          })}
        </section>

        {/* Detailed Selected Aircraft Briefing + Launch Action */}
        <footer className="flex flex-col gap-4 border-2 border-slate-800 bg-[#071020]/95 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:flex lg:items-center lg:gap-8">
            <div>
              <span className="font-arcade block text-[8px] text-[#F6B40E]">INDICATIVO · 1982</span>
              <p className="mt-1 text-sm font-bold text-white">{activeSpec.callsign}</p>
              <p className="text-xs text-[#74ACDF]">{activeSpec.pilot} · {activeSpec.base}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-arcade text-[8px] text-slate-300">VELOCIDAD</span>
                <StatBlocks value={activeSpec.statSpeed} color="bg-cyan-400" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-arcade text-[8px] text-slate-300">POTENCIA</span>
                <StatBlocks value={activeSpec.statPower} color="bg-[#F6B40E]" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-arcade text-[8px] text-slate-300">BLINDAJE</span>
                <StatBlocks value={activeSpec.statArmor} color="bg-emerald-400" />
              </div>
            </div>

            <div className="text-xs text-slate-300 max-w-xs">
              <span className="block font-semibold text-white">Historial operativo (Malvinas 1982):</span>
              <span>{activeSpec.historicalAction}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onLaunchMission}
              className="font-arcade w-full lg:w-auto cursor-pointer whitespace-nowrap border-2 border-[#FDE047] bg-[#74ACDF] px-7 py-4 text-xs sm:text-sm text-[#050A14] shadow-[0_4px_0_#1E40AF] transition-transform duration-100 hover:bg-[#93C5FD] active:translate-y-0.5"
            >
              DESPEGAR
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
