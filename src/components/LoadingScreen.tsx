import { useEffect, useRef, useState } from 'react';
import { CondorSkyhawkLogo } from './CondorSkyhawkLogo';

interface LoadingScreenProps {
  onLoaded: () => void;
  onUnlockMusic: () => void;
}

const LOADING_DURATION_MS = 2200;

export function LoadingScreen({ onLoaded, onUnlockMusic }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  useEffect(() => {
    // Preload title screen key art during loading screen
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.src = '/src/assets/images/sheffield_sinking_keyart_1794901418771.jpg';

    const start = performance.now();
    let rafId = 0;
    let done = false;
    let faded = false;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / LOADING_DURATION_MS);
      const eased = 1 - Math.pow(1 - ratio, 2);
      setPercent(Math.round(eased * 100));

      if (elapsed >= LOADING_DURATION_MS - 260 && !faded) {
        faded = true;
        setFadingOut(true);
      }
      if (elapsed >= LOADING_DURATION_MS && !done) {
        done = true;
        onLoadedRef.current();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#040812] px-6 select-none transition-opacity duration-300 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={onUnlockMusic}
    >
      {/* Top Argentine Celeste-Blanco-Celeste Ribbon */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 flex h-1.5">
        <div className="h-full flex-1 bg-[#74ACDF]" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-[#74ACDF]" />
      </div>

      <div className="arcade-scanlines pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <CondorSkyhawkLogo className="mb-5 h-24 w-24 drop-shadow-[0_6px_20px_rgba(116,172,223,0.28)]" />

        <p className="font-arcade text-[10px] tracking-widest text-[#74ACDF]">
          ATLÁNTICO SUR · MALVINAS 1982
        </p>

        <h1 className="font-display mt-2 text-2xl font-bold tracking-wide text-white sm:text-3xl">
          CÓNDORES DEL SUR
        </h1>

        <p className="mt-2 text-xs text-slate-400">
          Preparando escuadrón aeronaval, cubierta del ARA V-2 y mar austral...
        </p>

        {/* Loading Progress Bar */}
        <div className="mt-7 w-full">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-arcade text-[9px] text-slate-300">CARGANDO</span>
            <span className="font-arcade text-[10px] text-[#F6B40E] tabular-nums">
              {String(percent).padStart(3, '0')}%
            </span>
          </div>
          <div className="h-2.5 w-full border border-slate-700 bg-[#081120] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#74ACDF] via-white to-[#F6B40E]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <p className="mt-8 text-xs font-semibold text-[#F6B40E]">
          Papafrita Magazin Producciones · Hecho por Juan Martin Echegaray
        </p>
      </div>
    </div>
  );
}
