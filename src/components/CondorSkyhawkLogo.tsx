import { useState } from 'react';

interface CondorSkyhawkLogoProps {
  className?: string;
}

/**
 * Emblema oficial de Cóndores del Sur: rostro furioso del Cóndor Andino
 * enmarcado en medallón dorado y colores celeste y blanco.
 */
export function CondorSkyhawkLogo({ className = 'h-24 w-24' }: CondorSkyhawkLogoProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-full border-2 border-[#F6B40E] bg-[#050A14] shadow-[0_6px_22px_rgba(0,0,0,0.85)] ${className}`}
      role="img"
      aria-label="Logo Cóndores del Sur: cara de un cóndor andino furioso"
    >
      {!imgError ? (
        <img
          src="/src/assets/images/condor_furioso_logo_1794903985863.jpg"
          alt="Emblema de cóndor andino furioso de Cóndores del Sur 1982"
          referrerPolicy="no-referrer"
          className="h-full w-full scale-[1.14] object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
          <circle cx="60" cy="60" r="56" fill="#071120" stroke="#74ACDF" strokeWidth="4" />
          {/* Snowy white Andean collar */}
          <path
            d="M 18 82 L 32 72 L 42 86 L 54 76 L 60 92 L 68 76 L 80 86 L 90 72 L 102 84 L 92 102 Q 60 114 28 102 Z"
            fill="#F8FAFC"
            stroke="#020617"
            strokeWidth="2"
          />
          {/* Dark plumage head */}
          <path
            d="M 28 74 C 24 44 40 26 64 26 C 84 26 94 42 94 60 L 82 76 L 40 78 Z"
            fill="#1E293B"
            stroke="#020617"
            strokeWidth="2"
          />
          {/* Crimson Andean comb crest */}
          <path
            d="M 52 28 C 50 14 66 12 72 20 C 78 16 86 24 82 36 L 60 36 Z"
            fill="#B91C1C"
            stroke="#020617"
            strokeWidth="2"
          />
          {/* Fierce brow and blazing golden eye */}
          <path d="M 46 44 L 68 50 L 66 56 L 44 50 Z" fill="#0F172A" />
          <polygon points="50,48 63,51 56,56" fill="#F6B40E" />
          {/* Hooked roaring condor beak */}
          <path
            d="M 68 48 L 102 52 C 106 60 100 72 92 76 L 86 64 L 68 62 Z"
            fill="#E2C792"
            stroke="#020617"
            strokeWidth="2"
          />
          <path d="M 66 64 L 88 74 L 74 78 L 62 70 Z" fill="#B4965C" stroke="#020617" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
}
