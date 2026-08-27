"use client";

type Mood = "idle" | "happy" | "sad" | "excited";

export default function Mascot({
  mood = "idle",
  size = 64,
  floaty = false,
  className = "",
}: {
  mood?: Mood;
  size?: number;
  floaty?: boolean;
  className?: string;
}) {
  const mouth = {
    idle: "M70,118 Q90,130 110,118",
    happy: "M65,115 Q90,140 115,115 Q90,130 65,115",
    sad: "M70,128 Q90,112 110,128",
    excited: "M62,112 Q90,145 118,112 Q90,128 62,112",
  }[mood];

  const eyebrow = mood === "sad";
  const sparkle = mood === "excited" || mood === "happy";

  return (
    <div
      className={`${floaty ? "animate-floaty" : ""} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Rex, o dinossauro mascote, com expressão de ${mood}`}
    >
      <svg viewBox="0 0 180 180" width="100%" height="100%">
        <ellipse cx="90" cy="168" rx="46" ry="8" fill="#000000" opacity="0.15" />
        <path d="M28,120 C10,110 8,90 22,78 C30,92 34,104 40,112 Z" fill="#E1502F" />
        <path
          d="M40,150 C22,150 16,128 24,108 C18,92 24,70 44,58 C46,40 66,26 90,26
             C118,26 138,44 140,66 C154,74 158,94 148,110 C152,128 140,150 118,150 Z"
          fill="#FF6B4A"
        />
        <path
          d="M62,146 C56,120 58,96 74,80 C90,66 112,68 122,84 C132,100 128,126 112,144 C96,158 70,158 62,146 Z"
          fill="#FFD08A"
          opacity="0.9"
        />
        <path d="M58,42 L68,24 L76,44 Z" fill="#4FD1AE" />
        <path d="M84,32 L94,12 L102,34 Z" fill="#4FD1AE" />
        <path d="M110,38 L120,20 L126,42 Z" fill="#4FD1AE" />
        <path d="M132,108 C144,110 152,120 148,132 C142,128 134,122 128,116 Z" fill="#E1502F" />
        <ellipse
          cx="112"
          cy="82"
          rx="14"
          ry="16"
          fill="#0F1B22"
          className="animate-blink"
          style={{ transformOrigin: "112px 82px" }}
        />
        <circle cx="116" cy="77" r="4" fill="#F4EFE6" />
        {eyebrow && (
          <path d="M98,60 Q112,52 128,60" stroke="#0F1B22" strokeWidth="4" fill="none" strokeLinecap="round" />
        )}
        <circle cx="146" cy="98" r="2.5" fill="#0F1B22" opacity="0.6" />
        <path d={mouth} stroke="#0F1B22" strokeWidth="4" fill="none" strokeLinecap="round" />
        {(mood === "happy" || mood === "excited") && (
          <path d="M78,120 L82,128 L86,120 Z" fill="#F4EFE6" />
        )}
        <ellipse cx="70" cy="158" rx="14" ry="8" fill="#E1502F" />
        <ellipse cx="112" cy="160" rx="16" ry="9" fill="#E1502F" />
        {sparkle && (
          <>
            <path d="M40,50 l3,8 8,3 -8,3 -3,8 -3,-8 -8,-3 8,-3z" fill="#FFB84D" />
            <path d="M150,50 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2z" fill="#4FD1AE" />
          </>
        )}
      </svg>
    </div>
  );
}
