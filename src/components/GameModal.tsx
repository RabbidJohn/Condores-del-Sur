import { getAircraftSpec } from '../game/aircraft';
import { HudSnapshot } from '../game/types';

interface GameModalProps {
  hud: HudSnapshot;
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
  onReplayTribute?: () => void;
}

export function GameModal({
  hud,
  onResume,
  onRestart,
  onReturnTitle,
  onReplayTribute,
}: GameModalProps) {
  if (hud.phase !== 'PAUSED' && hud.phase !== 'VICTORY' && hud.phase !== 'GAME_OVER') {
    return null;
  }

  const isPaused = hud.phase === 'PAUSED';
  const isVictory = hud.phase === 'VICTORY';
  const spec = getAircraftSpec(hud.aircraftId);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#04070E]/85 p-4">
      <div className="w-full max-w-sm border-2 border-[#74ACDF] bg-[#070E1A] p-5 shadow-2xl">
        <div className="mb-4 border-b border-slate-800 pb-3">
          <div className="font-arcade mb-2 text-[9px] text-[#74ACDF]">
            {isPaused ? 'PAUSA' : isVictory ? 'VICTORIA FINAL' : 'GAME OVER'} · NIVEL {hud.waveNumber}/{hud.totalWaves}
          </div>
          <h2 className="font-arcade text-sm leading-relaxed text-white">
            {isPaused
              ? 'MISIÓN PAUSADA'
              : isVictory
                ? 'ATLÁNTICO SUR LIBERADO'
                : `${spec.callsign.split(' ')[0]} DERRIBADO`}
          </h2>
          {isVictory && (
            <p className="mt-2 text-xs text-slate-300">
              Superaste los 20 niveles con el {spec.name} y completaste la gesta aérea de 1982.
            </p>
          )}
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2.5 text-xs">
          <div className="border border-slate-800 bg-[#040912] p-2.5">
            <span className="block text-[10px] text-slate-400">Puntaje</span>
            <span className="font-arcade text-xs text-[#F6B40E]">
              {String(hud.score).padStart(7, '0')}
            </span>
          </div>
          <div className="border border-slate-800 bg-[#040912] p-2.5">
            <span className="block text-[10px] text-slate-400">Hi-Score</span>
            <span className="font-arcade text-xs text-[#74ACDF]">
              {String(hud.highScore).padStart(7, '0')}
            </span>
          </div>
          <div className="border border-slate-800 bg-[#040912] p-2.5">
            <span className="block text-[10px] text-slate-400">Enemigos</span>
            <span className="font-arcade text-xs text-white">{hud.enemiesDefeated}</span>
          </div>
          <div className="border border-slate-800 bg-[#040912] p-2.5">
            <span className="block text-[10px] text-slate-400">Buques</span>
            <span className="font-arcade text-xs text-white">{hud.shipsSunk}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isPaused && (
            <button
              type="button"
              onClick={onResume}
              className="font-arcade w-full cursor-pointer whitespace-nowrap border-2 border-[#FDE047] bg-[#74ACDF] px-4 py-3 text-xs text-[#050A14] hover:bg-[#93C5FD]"
            >
              REANUDAR
            </button>
          )}

          {isVictory && onReplayTribute && (
            <button
              type="button"
              onClick={onReplayTribute}
              className="font-arcade w-full cursor-pointer whitespace-nowrap border-2 border-[#F6B40E] bg-[#0B1C34] px-4 py-3 text-[11px] text-[#FDE68A] hover:bg-[#132A4A]"
            >
              VER VIDEO HOMENAJE
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            className={`font-arcade w-full cursor-pointer whitespace-nowrap border-2 px-4 py-3 text-xs ${
              isPaused
                ? 'border-slate-600 bg-[#0E1B2E] text-slate-100 hover:border-[#74ACDF]'
                : 'border-[#FDE047] bg-[#74ACDF] text-[#050A14] hover:bg-[#93C5FD]'
            }`}
          >
            JUGAR DE NUEVO
          </button>

          <button
            type="button"
            onClick={onReturnTitle}
            className="font-arcade w-full cursor-pointer whitespace-nowrap border border-slate-700 bg-transparent px-4 py-2.5 text-[10px] text-slate-300 hover:border-slate-500 hover:text-white"
          >
            VOLVER AL INICIO
          </button>
        </div>
      </div>
    </div>
  );
}
