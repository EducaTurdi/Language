import Link from "next/link";
import { Unit } from "@/lib/types";

export default function ProgressPath({
  units,
  completedIds,
  trackId,
}: {
  units: Unit[];
  completedIds: Set<string>;
  trackId: string;
}) {
  let unlockedFound = false;

  return (
    <div className="space-y-10">
      {units.map((unit, unitIdx) => (
        <div key={unit.id}>
          <div className="mb-4">
            <p className="text-xs font-bold text-seafoam uppercase tracking-widest">
              Camada {unitIdx + 1}
            </p>
            <h2 className="font-display font-bold text-xl text-cream">
              {unit.title}
            </h2>
            <p className="text-cream-muted text-sm">{unit.description}</p>
          </div>

          <div className="relative pl-2">
            <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-night-border" />
            <div className="space-y-3">
              {unit.lessons.map((lesson) => {
                const done = completedIds.has(lesson.id);
                const isUnlocked = done || !unlockedFound;
                if (isUnlocked && !done) unlockedFound = true;

                const base =
                  "relative z-10 flex items-center gap-4 rounded-xl2 border p-4 transition-all";

                if (!isUnlocked) {
                  return (
                    <div
                      key={lesson.id}
                      className={`${base} bg-night-card/40 border-night-border opacity-50 cursor-not-allowed`}
                    >
                      <span className="w-11 h-11 flex items-center justify-center rounded-full bg-night border border-night-border text-lg">
                        🔒
                      </span>
                      <div>
                        <p className="text-cream-muted font-semibold text-sm">{lesson.title}</p>
                        <p className="text-cream-faint text-xs">Complete a lição anterior</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={lesson.id}
                    href={`/dashboard/lesson/${lesson.id}`}
                    className={`${base} bg-night-card border-night-border hover:border-seafoam group`}
                  >
                    <span
                      className={`w-11 h-11 flex items-center justify-center rounded-full text-xl shrink-0 ${
                        done
                          ? "bg-seafoam text-night"
                          : "bg-fossil text-night animate-stepGlow"
                      }`}
                    >
                      {done ? "✓" : lesson.emoji}
                    </span>
                    <div className="flex-1">
                      <p className="text-cream font-semibold text-sm group-hover:text-seafoam transition-colors">
                        {lesson.title}
                      </p>
                      <p className="text-cream-faint text-xs">
                        {done ? "Concluída" : `+${lesson.xp} XP`}
                      </p>
                    </div>
                    <span className="text-cream-faint group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
