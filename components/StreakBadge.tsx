export function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-2 bg-night-card border border-night-border rounded-xl px-3 py-2">
      <span className="text-xl">🔥</span>
      <div>
        <p className="text-cream font-bold text-sm leading-none">{streak}</p>
        <p className="text-cream-faint text-[11px] leading-none mt-0.5">dias seguidos</p>
      </div>
    </div>
  );
}

export function HeartsIndicator({ hearts }: { hearts: number }) {
  return (
    <div className="flex items-center gap-2 bg-night-card border border-night-border rounded-xl px-3 py-2">
      <span className="text-xl">❤️</span>
      <div>
        <p className="text-cream font-bold text-sm leading-none">{hearts}</p>
        <p className="text-cream-faint text-[11px] leading-none mt-0.5">vidas</p>
      </div>
    </div>
  );
}
