export default function XPBar({ xp }: { xp: number }) {
  const level = Math.floor(xp / 100) + 1;
  const intoLevel = xp % 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-amber uppercase tracking-wide">
          Nível {level}
        </span>
        <span className="text-xs text-cream-faint">{xp} XP</span>
      </div>
      <div className="h-3 bg-night rounded-full overflow-hidden border border-night-border">
        <div
          className="h-full bg-gradient-to-r from-amber to-fossil rounded-full transition-all duration-700"
          style={{ width: `${intoLevel}%` }}
        />
      </div>
    </div>
  );
}
