import { Music, Volume2, VolumeX } from 'lucide-react';
import { useEffect } from 'react';
import { CondorSkyhawkLogo } from './CondorSkyhawkLogo';

interface TitleScreenProps {
  highScore: number;
  muted: boolean;
  musicMuted: boolean;
  onProceedToSelect: () => void;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onUnlockMusic: () => void;
}

export function TitleScreen({
  highScore,
  muted,
  musicMuted,
  onProceedToSelect,
  onToggleMute,
  onToggleMusic,
  onUnlockMusic,
}: TitleScreenProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      onUnlockMusic();
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onProceedToSelect();
      }
    };
    const onPointer = () => {
      onUnlockMusic();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [onProceedToSelect, onUnlockMusic]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05080F] select-none">
      {/* Fallback atmospheric ocean/sky mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#081424] via-[#0E223B] to-[#050A12]" />

      {/* Generated 16:9 HMS Sheffield Sinking Key Art Backdrop */}
      <img
        src="/src/assets/images/sheffield_sinking_keyart_1794901418771.jpg"
        alt="Hundimiento del destructor británico HMS Sheffield D80 en el Atlántico Sur mientras atacan aeronaves argentinas"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-right"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />

      {/* Directional contrast scrim leaving HMS Sheffield vividly visible on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#040810]/92 via-[#040810]/60 to-transparent" />
      <div className="arcade-scanlines pointer-events-none absolute inset-0 opacity-20" />

      {/* Top Argentine Celeste-Blanco-Celeste Ribbon */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-20 flex h-1.5">
        <div className="h-full flex-1 bg-[#74ACDF]" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-[#74ACDF]" />
      </div>

      {/* Top right audio & music toggles */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        {highScore > 0 && (
          <div className="mr-2 text-right">
            <span className="font-arcade block text-[9px] text-slate-300">HI-SCORE</span>
            <p className="font-arcade text-sm text-[#F6B40E]">
              {String(highScore).padStart(7, '0')}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            onUnlockMusic();
            onToggleMusic();
          }}
          title="Banda sonora: El Visitante - Almafuerte"
          className="flex h-10 cursor-pointer items-center gap-2 border-2 border-slate-700 bg-[#08101E]/95 px-3 text-xs font-semibold text-slate-200 transition-colors hover:border-[#74ACDF]"
        >
          <Music className={`h-4 w-4 ${musicMuted ? 'text-slate-500' : 'text-[#74ACDF]'}`} />
          <span className="whitespace-nowrap">
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
          className="flex h-10 w-10 cursor-pointer items-center justify-center border-2 border-slate-700 bg-[#08101E]/95 text-slate-200 transition-colors hover:border-[#74ACDF]"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Epic Title Lockup on Left Side so HMS Sheffield Shines on Right */}
      <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center px-8 py-12 sm:px-14">
        <div className="mb-4 flex items-center gap-2.5 text-xs font-semibold tracking-widest text-[#74ACDF]">
          <span>ATLÁNTICO SUR</span>
          <span aria-hidden="true">·</span>
          <span>MALVINAS 1982</span>
          <span aria-hidden="true">·</span>
          <span>ARCADE CLÁSICO</span>
        </div>

        {/* Large Fused Condor + Argentine Skyhawk Emblem */}
        <div className="mb-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <CondorSkyhawkLogo className="h-28 w-28 sm:h-32 sm:w-32 shrink-0 drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]" />

          <svg
            viewBox="0 0 430 120"
            className="w-full max-w-[400px] drop-shadow-[0_4px_0_rgba(0,0,0,0.95)]"
            role="img"
            aria-label="Cóndores del Sur 1982"
          >
            <defs>
              <linearGradient id="argBandTitle" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#74ACDF" />
                <stop offset="50%" stopColor="#F8FAFC" />
                <stop offset="100%" stopColor="#74ACDF" />
              </linearGradient>
            </defs>

            <text
              x="2"
              y="38"
              fill="#F8FAFC"
              fontFamily="'Press Start 2P', monospace"
              fontSize="30"
              letterSpacing="1"
            >
              CÓNDORES
            </text>
            <text
              x="2"
              y="84"
              fill="url(#argBandTitle)"
              fontFamily="'Press Start 2P', monospace"
              fontSize="34"
              letterSpacing="2"
            >
              DEL SUR
            </text>

            <rect x="4" y="100" width="210" height="5" fill="url(#argBandTitle)" />
            <text
              x="228"
              y="111"
              fill="#F6B40E"
              fontFamily="'Press Start 2P', monospace"
              fontSize="20"
              letterSpacing="2"
            >
              1982
            </text>
          </svg>
        </div>

        {/* Required Author Credit */}
        <p className="font-display mb-5 text-xl font-bold tracking-wide text-[#F6B40E] sm:text-2xl">
          Hecho por Juan Martin Echegaray
        </p>

        <p className="mb-8 max-w-lg text-sm leading-relaxed text-slate-200 sm:text-base">
          Despega desde el continente en 20 misiones aéreas y navales sobre las Islas Malvinas.
          Elige tu escuadrilla y enfrenta a la Task Force británica en alta mar.
        </p>

        {/* Primary CTA advancing to Character & Aircraft Selection */}
        <div className="flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => {
              onUnlockMusic();
              onProceedToSelect();
            }}
            className="font-arcade cursor-pointer whitespace-nowrap border-2 border-[#FDE047] bg-[#74ACDF] px-7 py-4 text-xs sm:text-sm text-[#050A14] shadow-[0_4px_0_#1E40AF] transition-transform duration-100 hover:bg-[#93C5FD] active:translate-y-0.5"
          >
            INICIAR
          </button>

          <span className="font-arcade text-[10px] text-[#FDE047]">
            INSERT COIN · PRESS START
          </span>
        </div>
      </div>

      {/* Subtle HMS Sheffield historical caption at bottom-right */}
      <div className="pointer-events-none absolute right-6 bottom-4 z-10 hidden sm:block text-right">
        <span className="font-arcade text-[8px] text-slate-300/80">
          HMS SHEFFIELD (D80) · 4 DE MAYO DE 1982
        </span>
      </div>
    </div>
  );
}
