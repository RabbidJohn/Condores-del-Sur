import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { getAircraftSpec } from '../game/aircraft';
import { HudSnapshot } from '../game/types';

interface HudOverlayProps {
  hud: HudSnapshot;
  muted: boolean;
  musicMuted: boolean;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onTogglePause: () => void;
  onTouchMove: (dx: number, dy: number) => void;
  onTouchFire: (firing: boolean) => void;
  onBomb: () => void;
  onExocet: () => void;
  onSkipBossIntro?: () => void;
}

export function HudOverlay({
  hud,
  muted,
  musicMuted,
  onToggleMute,
  onToggleMusic,
  onTogglePause,
  onTouchMove,
  onTouchFire,
  onBomb,
  onExocet,
  onSkipBossIntro,
}: HudOverlayProps) {
  const spec = getAircraftSpec(hud.aircraftId);
  const bossPct =
    hud.bossMaxHp > 0 ? Math.max(0, Math.min(100, (hud.bossHp / hud.bossMaxHp) * 100)) : 0;

  const shortBomb =
    hud.aircraftId === 'super_etendard'
      ? 'ZUNI'
      : hud.aircraftId === 'pucara'
        ? 'LAU61'
        : 'BOMBA';
  const shortSpecial =
    hud.aircraftId === 'dagger'
      ? 'SHAFR'
      : hud.aircraftId === 'pucara'
        ? 'PESC'
        : 'EXO';

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-2.5 sm:p-3 select-none">
      {/* Classic 1942/1943/Aero Fighters Top Arcade Scoreboard Strip */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          {/* 1UP & HI-SCORE */}
          <div className="flex items-start gap-4 px-1 py-0.5 drop-shadow-[0_2px_0_rgba(0,0,0,0.95)]">
            <div>
              <span className="font-arcade block text-[9px] text-[#74ACDF]">
                1UP · {spec.callsign.split(' ')[0]}
              </span>
              <span className="font-arcade text-xs sm:text-sm text-white">
                {String(hud.score).padStart(7, '0')}
              </span>
            </div>
            <div>
              <span className="font-arcade block text-[9px] text-[#F6B40E]">HI-SCORE</span>
              <span className="font-arcade text-xs sm:text-sm text-[#FDE047]">
                {String(hud.highScore).padStart(7, '0')}
              </span>
            </div>
          </div>

          {/* Right: Stage, Segmented Energy Bar, Lives & Controls */}
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-end gap-1 drop-shadow-[0_2px_0_rgba(0,0,0,0.95)]">
              <div className="flex items-center gap-2">
                <span className="font-arcade text-[9px] text-[#74ACDF]">
                  NIV {hud.waveNumber}/{hud.totalWaves}
                </span>
                <div className="flex items-center gap-0.5">
                  {hud.lives > 5 ? (
                    <div className="flex items-center gap-1">
                      <svg
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5 text-[#F8FAFC]"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M7 1h2v5l5 5v2l-5-2v3l2 1v1H5v-1l2-1v-3l-5 2v-2l5-5V1z" />
                      </svg>
                      <span className="font-arcade text-[9px] text-[#F8FAFC]">
                        ×{hud.lives}
                      </span>
                    </div>
                  ) : (
                    Array.from({ length: Math.max(0, hud.lives) }).map((_, idx) => (
                      <svg
                        key={idx}
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5 text-[#F8FAFC]"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M7 1h2v5l5 5v2l-5-2v3l2 1v1H5v-1l2-1v-3l-5 2v-2l5-5V1z" />
                      </svg>
                    ))
                  )}
                </div>
              </div>

              {/* Segmented 1943 Midway Energy Blocks */}
              <div className="flex items-center gap-1">
                <span className="font-arcade text-[8px] text-slate-300">POW</span>
                <div className="flex gap-0.5 border border-black bg-black/70 p-0.5">
                  {Array.from({ length: hud.maxHp }).map((_, i) => {
                    const filled = i < hud.hp;
                    const color =
                      hud.hp <= 1
                        ? 'bg-red-500'
                        : hud.hp <= 2
                          ? 'bg-amber-400'
                          : 'bg-[#74ACDF]';
                    return (
                      <span
                        key={i}
                        className={`h-2.5 w-3 ${filled ? color : 'bg-slate-800'}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Pause / Music / Sound Buttons */}
            <div className="pointer-events-auto flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleMusic}
                aria-label={musicMuted ? 'Activar música' : 'Silenciar música'}
                title={musicMuted ? 'Música apagada' : 'Música encendida'}
                className={`flex h-7 w-7 cursor-pointer items-center justify-center border bg-[#060C18]/90 transition-colors ${
                  musicMuted
                    ? 'border-slate-700 text-slate-500'
                    : 'border-[#74ACDF]/70 text-[#74ACDF] hover:text-white'
                }`}
              >
                <Music className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onToggleMute}
                aria-label={muted ? 'Activar audio' : 'Silenciar audio'}
                title={muted ? 'Audio silenciado' : 'Audio activo'}
                className="flex h-7 w-7 cursor-pointer items-center justify-center border border-slate-700 bg-[#060C18]/90 text-slate-200 transition-colors hover:border-[#74ACDF] hover:text-white"
              >
                {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={onTogglePause}
                aria-label={hud.phase === 'PAUSED' ? 'Reanudar' : 'Pausar'}
                className="flex h-7 w-7 cursor-pointer items-center justify-center border border-slate-700 bg-[#060C18]/90 text-slate-200 transition-colors hover:border-[#74ACDF] hover:text-white"
              >
                {hud.phase === 'PAUSED' ? (
                  <Play className="h-3.5 w-3.5" />
                ) : (
                  <Pause className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Active Boss HP Bar */}
        {hud.bossName && (
          <div className="mx-auto w-full border-2 border-red-500/80 bg-[#05080F]/92 px-2.5 py-1.5 shadow-lg">
            <div className="mb-1 flex items-start justify-between gap-2.5">
              <span className="font-arcade min-w-0 flex-1 text-[8px] sm:text-[9px] leading-snug text-red-400 break-words">
                {hud.bossName}
              </span>
              <span className="font-arcade shrink-0 pt-0.5 text-[8px] text-amber-300">
                HP {hud.bossHp}
              </span>
            </div>
            <div className="h-2 w-full border border-slate-700 bg-slate-900">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-400"
                style={{ width: `${bossPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Boss Self-Presentation & Weapons Briefing Card */}
      {hud.bossIntro && (
        <div className="pointer-events-auto mx-auto my-auto flex w-[96%] max-w-[430px] flex-col border-2 border-red-500 bg-[#05080F]/95 px-3.5 py-3 shadow-[0_0_32px_rgba(239,68,68,0.45)]">
          <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-red-900/70 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 animate-ping bg-red-500" />
              <span className="font-arcade text-[8px] text-red-400">
                JEFE DETECTADO · NIVEL {hud.bossIntro.level}
              </span>
            </div>
            <span className="font-arcade text-[8px] text-amber-300">
              DUELO EN {hud.bossIntro.secondsLeft}S
            </span>
          </div>

          <h3 className="font-arcade text-[10px] sm:text-[11px] leading-snug text-white break-words">
            {hud.bossIntro.name}
          </h3>
          <p className="mt-0.5 text-[10px] font-bold tracking-wider text-sky-300 uppercase">
            {hud.bossIntro.vesselClass}
          </p>

          <p className="mt-2 border-l-2 border-red-500 bg-red-950/35 px-2.5 py-1.5 text-[11px] italic leading-snug text-slate-100">
            {hud.bossIntro.greeting}
          </p>

          <div className="mt-2.5">
            <span className="font-arcade block text-[8px] text-[#F6B40E] mb-1">
              ARMAMENTO PRESENTADO:
            </span>
            <ul className="space-y-1">
              {hud.bossIntro.weapons.map((weapon, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-1.5 text-[11px] font-medium leading-tight text-slate-200"
                >
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 bg-red-400" />
                  <span>{weapon}</span>
                </li>
              ))}
            </ul>
          </div>

          {onSkipBossIntro && (
            <div className="mt-2.5 flex justify-end">
              <button
                type="button"
                onClick={onSkipBossIntro}
                className="font-arcade cursor-pointer border border-amber-400/70 bg-amber-950/60 px-2.5 py-1 text-[8px] text-amber-200 hover:bg-amber-900/70 hover:text-white"
              >
                COMENZAR AHORA ▶
              </button>
            </div>
          )}
        </div>
      )}

      {/* Transient Stage / Boss Alert */}
      {!hud.bossIntro && hud.bannerText && (
        <div className="mx-auto my-auto flex w-[94%] max-w-[420px] flex-col items-center border-2 border-[#74ACDF] bg-[#050A14]/92 px-4 py-3 text-center">
          <p className="font-arcade text-[11px] sm:text-xs leading-relaxed text-[#F6B40E] break-words">
            {hud.bannerText}
          </p>
          {hud.bannerSubtext && (
            <p className="mt-1.5 text-[11px] sm:text-xs font-semibold leading-snug text-slate-200 break-words">
              {hud.bannerSubtext}
            </p>
          )}
        </div>
      )}

      {/* Bottom Retro Arcade Arsenal Readout + Touch Controls */}
      <div className="flex flex-col gap-1.5">
        <div className="pointer-events-auto flex items-end justify-between md:hidden">
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              type="button"
              onPointerDown={() => onTouchMove(0, -1)}
              onPointerUp={() => onTouchMove(0, 0)}
              onPointerLeave={() => onTouchMove(0, 0)}
              className="flex h-11 w-11 items-center justify-center border border-slate-600 bg-[#0A1525]/90 text-sm font-bold text-white active:bg-[#74ACDF]/40"
            >
              ▲
            </button>
            <div />
            <button
              type="button"
              onPointerDown={() => onTouchMove(-1, 0)}
              onPointerUp={() => onTouchMove(0, 0)}
              onPointerLeave={() => onTouchMove(0, 0)}
              className="flex h-11 w-11 items-center justify-center border border-slate-600 bg-[#0A1525]/90 text-sm font-bold text-white active:bg-[#74ACDF]/40"
            >
              ◀
            </button>
            <button
              type="button"
              onPointerDown={() => onTouchMove(0, 1)}
              onPointerUp={() => onTouchMove(0, 0)}
              onPointerLeave={() => onTouchMove(0, 0)}
              className="flex h-11 w-11 items-center justify-center border border-slate-600 bg-[#0A1525]/90 text-sm font-bold text-white active:bg-[#74ACDF]/40"
            >
              ▼
            </button>
            <button
              type="button"
              onPointerDown={() => onTouchMove(1, 0)}
              onPointerUp={() => onTouchMove(0, 0)}
              onPointerLeave={() => onTouchMove(0, 0)}
              className="flex h-11 w-11 items-center justify-center border border-slate-600 bg-[#0A1525]/90 text-sm font-bold text-white active:bg-[#74ACDF]/40"
            >
              ▶
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onBomb}
              className="font-arcade flex h-11 min-w-[66px] items-center justify-center border-2 border-amber-400 bg-amber-950/90 px-2 text-[9px] text-amber-300"
            >
              {shortBomb}({hud.bombs})
            </button>
            <button
              type="button"
              onClick={onExocet}
              className="font-arcade flex h-11 min-w-[70px] items-center justify-center border-2 border-[#74ACDF] bg-sky-950/90 px-2 text-[9px] text-[#74ACDF]"
            >
              {shortSpecial}({hud.exocets})
            </button>
            <button
              type="button"
              onPointerDown={() => onTouchFire(true)}
              onPointerUp={() => onTouchFire(false)}
              onPointerLeave={() => onTouchFire(false)}
              className="font-arcade flex h-11 min-w-[54px] items-center justify-center border-2 border-slate-400 bg-slate-800/90 px-2 text-[9px] text-white"
            >
              TIRO
            </button>
          </div>
        </div>

        {/* Active Temporary Power-up Timers */}
        {(hud.rapidFireSec > 0 || hud.shieldSec > 0 || hud.clusterSec > 0) && (
          <div className="flex flex-wrap items-center gap-3 px-1 drop-shadow-[0_2px_0_rgba(0,0,0,0.95)]">
            {hud.rapidFireSec > 0 && (
              <span className="font-arcade text-[9px] text-fuchsia-300">
                TURBO {hud.rapidFireSec}s
              </span>
            )}
            {hud.shieldSec > 0 && (
              <span className="font-arcade text-[9px] text-sky-300">
                ESCUDO {hud.shieldSec}s
              </span>
            )}
            {hud.clusterSec > 0 && (
              <span className="font-arcade text-[9px] text-orange-300">
                RACIMO {hud.clusterSec}s
              </span>
            )}
          </div>
        )}

        {/* Bottom Classic Arcade Ordnance Bar */}
        <div className="flex items-center justify-between gap-2 px-1 py-0.5 drop-shadow-[0_2px_0_rgba(0,0,0,0.95)]">
          <div className="flex items-center gap-4">
            <span className="font-arcade text-[9px] text-cyan-300">
              ARMA:N{hud.cannonLevel}
            </span>
            <span className="font-arcade text-[9px] text-[#F6B40E]">
              {shortBomb}[X]:{hud.bombs}
            </span>
            <span className="font-arcade text-[9px] text-[#74ACDF]">
              {shortSpecial}[C]:{hud.exocets}
            </span>
          </div>
          <span className="hidden sm:inline font-arcade text-[8px] text-slate-300">
            ESPACIO:TIRO · F:AUTO · ESC:PAUSA
          </span>
        </div>
      </div>
    </div>
  );
}
