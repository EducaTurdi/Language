"use client";

type Mood = "idle" | "happy" | "sad" | "excited" | "pensando" | "escrevendo";

// Rex 2.0 — corpo mais arredondado, cor invertida (base verde-água em vez de
// laranja), olhos grandes e cauda enrolada. Reage ao PROCESSO, não só ao
// resultado: "pensando" (dúvida/parado), "escrevendo" (atento, escolhendo
// ou digitando), além de acerto/erro.
export default function Mascot({
  mood = "idle",
  size = 160,
  floaty = true,
  className = "",
}: {
  mood?: Mood;
  size?: number;
  floaty?: boolean;
  className?: string;
}) {
  const boca: Record<Mood, string> = {
    idle: "M72,120 Q90,128 108,120",
    happy: "M66,114 Q90,142 114,114 Q90,130 66,114",
    sad: "M70,130 Q90,114 110,130",
    excited: "M60,110 Q90,148 120,110 Q90,130 60,110",
    pensando: "M76,122 Q90,118 104,124",
    escrevendo: "M74,120 Q90,124 106,120",
  };

  const olhoEstreito = mood === "pensando" || mood === "escrevendo";
  const sobrancelhaTriste = mood === "sad";
  const sobrancelhaPensando = mood === "pensando";
  const sparkle = mood === "excited" || mood === "happy";

  return (
    <div
      className={`${floaty ? "animate-floaty" : ""} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Rex, o mascote, com expressão de ${mood}`}
    >
      <svg viewBox="0 0 180 180" width="100%" height="100%">
        <ellipse cx="90" cy="166" rx="48" ry="8" fill="#000000" opacity="0.15" />

        {/* cauda enrolada */}
        <path
          d="M32,130 C14,132 6,114 14,98 C24,100 30,110 36,120 C40,110 48,106 56,110 C46,116 40,124 32,130 Z"
          fill="#2FA98A"
        />

        {/* corpo arredondado */}
        <path
          d="M46,158 C22,158 14,132 26,112 C18,90 32,62 62,52 C68,34 92,24 114,32
             C136,40 148,60 144,80 C160,88 162,112 148,126 C152,144 136,158 112,158 Z"
          fill="#4FD1AE"
        />

        {/* barriga clara */}
        <path
          d="M64,152 C54,128 58,100 78,84 C96,70 118,76 126,92 C134,108 128,132 110,148
             C94,160 72,162 64,152 Z"
          fill="#FFF6E8"
          opacity="0.95"
        />

        {/* placas nas costas — agora em coral, cor invertida */}
        <path d="M64,48 L74,28 L82,50 Z" fill="#FF6B4A" />
        <path d="M90,36 L100,14 L108,38 Z" fill="#FF6B4A" />
        <path d="M116,42 L126,22 L132,44 Z" fill="#FF6B4A" />

        {/* bracinho */}
        <path
          d="M138,102 C150,100 158,110 154,122 C148,118 140,112 134,108 Z"
          fill="#2FA98A"
        />

        {/* olho grande */}
        {olhoEstreito ? (
          <path
            d="M104,80 Q116,72 128,80"
            stroke="#0F1B22"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <g>
            <ellipse cx="118" cy="80" rx="15" ry="17" fill="#0F1B22" className="animate-blink" style={{ transformOrigin: "118px 80px" }} />
            <circle cx="122" cy="75" r="4.5" fill="#FFFFFF" />
          </g>
        )}

        {sobrancelhaTriste && (
          <path d="M104,58 Q118,50 134,58" stroke="#0F1B22" strokeWidth="4" fill="none" strokeLinecap="round" />
        )}
        {sobrancelhaPensando && (
          <path d="M100,64 L116,58" stroke="#0F1B22" strokeWidth="4" fill="none" strokeLinecap="round" />
        )}

        {/* narina */}
        <circle cx="150" cy="96" r="2.5" fill="#0F1B22" opacity="0.55" />

        {/* boca */}
        <path d={boca[mood]} stroke="#0F1B22" strokeWidth="4.5" fill="none" strokeLinecap="round" />

        {(mood === "happy" || mood === "excited") && (
          <path d="M84,122 L88,130 L92,122 Z" fill="#FFF6E8" />
        )}

        {/* balão de pensamento quando em dúvida */}
        {mood === "pensando" && (
          <>
            <circle cx="150" cy="46" r="5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="160" cy="34" r="7" fill="#FFFFFF" opacity="0.9" />
            <text x="160" y="39" fontSize="10" textAnchor="middle" fill="#0F1B22">?</text>
          </>
        )}

        {/* pernas */}
        <ellipse cx="70" cy="160" rx="15" ry="8" fill="#2FA98A" />
        <ellipse cx="116" cy="162" rx="17" ry="9" fill="#2FA98A" />

        {sparkle && (
          <>
            <path d="M42,52 l3,8 8,3 -8,3 -3,8 -3,-8 -8,-3 8,-3z" fill="#FFB84D" />
            <path d="M156,54 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2z" fill="#FF6B4A" />
          </>
        )}
      </svg>
    </div>
  );
}
