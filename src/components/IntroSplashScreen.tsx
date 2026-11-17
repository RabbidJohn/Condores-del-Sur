import { useEffect, useRef, useState } from 'react';

interface IntroSplashScreenProps {
  onComplete: () => void;
  onUnlockMusic: () => void;
}

const INTRO_DURATION_MS = 5000;

export function IntroSplashScreen({ onComplete, onUnlockMusic }: IntroSplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [imgError, setImgError] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const start = performance.now();
    let rafId = 0;
    let completed = false;
    let faded = false;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(1, elapsed / INTRO_DURATION_MS);
      setProgress(pct);

      if (elapsed >= INTRO_DURATION_MS - 420 && !faded) {
        faded = true;
        setFadingOut(true);
      }

      if (elapsed >= INTRO_DURATION_MS && !completed) {
        completed = true;
        onCompleteRef.current();
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const handleGesture = () => {
      onUnlockMusic();
    };
    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture);
    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [onUnlockMusic]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#03060E] px-6 select-none transition-opacity duration-500 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={onUnlockMusic}
    >
      {/* Subtle CRT arcade scanlines */}
      <div className="arcade-scanlines pointer-events-none absolute inset-0 opacity-15" />

      {/* Center Studio Logo Plate */}
      <div className="relative flex w-full max-w-3xl flex-col items-center">
        <div
          className="relative w-full aspect-video overflow-hidden border border-slate-800/80 bg-[#04070E] shadow-[0_0_90px_rgba(246,180,14,0.16)] transition-transform duration-1000 ease-out"
          style={{
            transform: `scale(${0.96 + Math.min(0.04, progress * 0.08)})`,
          }}
        >
          {!imgError ? (
            <img
              src="/src/assets/images/papafrita_magazin_logo_1794903882101.jpg"
              alt="Logo oficial de Papafrita Magazin Producciones"
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#081224] to-[#03060E] p-8 text-center">
              <span className="font-display text-3xl font-bold tracking-wider text-[#F6B40E] sm:text-5xl">
                PAPAFRITA MAGAZIN
              </span>
              <span className="font-arcade mt-3 text-sm tracking-[0.35em] text-[#74ACDF]">
                PRODUCCIONES
              </span>
            </div>
          )}
        </div>

        {/* Minimalist studio progress bar */}
        <div className="mt-6 flex w-full max-w-sm flex-col items-center gap-2">
          <div className="h-1 w-full overflow-hidden bg-slate-900">
            <div
              className="h-full bg-gradient-to-r from-[#74ACDF] via-[#FDE68A] to-[#F6B40E]"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <div className="flex w-full items-center justify-between text-[11px] text-slate-400">
            <span className="font-display tracking-widest uppercase">
              Presenta · Cóndores del Sur 1982
            </span>
            <button
              type="button"
              onClick={() => {
                onUnlockMusic();
                onComplete();
              }}
              className="cursor-pointer font-semibold text-slate-400 transition-colors hover:text-[#F6B40E] whitespace-nowrap"
            >
              Saltar →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
