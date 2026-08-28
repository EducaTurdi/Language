import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { tracks, totalLessons } from "@/lib/data/tracks";

export default async function DashboardHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("track_id")
    .eq("user_id", user?.id ?? "");

  const completedByTrack = (progress ?? []).reduce<Record<string, number>>(
    (acc, row) => {
      acc[row.track_id] = (acc[row.track_id] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display font-bold text-3xl text-cream mb-2">
        Suas trilhas
      </h1>
      <p className="text-cream-muted mb-10">
        Escolha uma trilha e continue de onde parou. Uma lição por vez.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {tracks.map((track) => {
          const total = totalLessons(track.id);
          const done = completedByTrack[track.id] ?? 0;
          const pct = total ? Math.round((done / total) * 100) : 0;

          const colorClasses: Record<string, string> = {
            fossil: "from-fossil to-fossil-dark",
            seafoam: "from-seafoam to-seafoam-dark",
            amber: "from-amber to-fossil",
          };

          return (
            <Link
              key={track.id}
              href={`/dashboard/course/${track.id}`}
              className="group bg-night-card border border-night-border hover:border-seafoam/60 rounded-xl2 p-7 transition-colors"
            >
              <div
                className={`w-14 h-14 rounded-xl2 bg-gradient-to-br ${colorClasses[track.color]} flex items-center justify-center text-2xl mb-5 shadow-pop`}
              >
                {track.icon}
              </div>
              <h2 className="font-display font-bold text-xl text-cream mb-1">
                {track.name}
              </h2>
              <p className="text-cream-muted text-sm mb-5">{track.tagline}</p>

              <div className="h-2.5 bg-night rounded-full overflow-hidden border border-night-border mb-2">
                <div
                  className="h-full bg-seafoam rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-cream-faint text-xs">
                {done} de {total} lições concluídas
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
