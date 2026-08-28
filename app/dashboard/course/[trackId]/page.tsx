import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTrack } from "@/lib/data/tracks";
import ProgressPath from "@/components/ProgressPath";

export default async function CoursePage({
  params,
}: {
  params: { trackId: string };
}) {
  const track = getTrack(params.trackId);
  if (!track) notFound();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user?.id ?? "")
    .eq("track_id", track.id);

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-cream-muted hover:text-cream text-sm font-semibold mb-6"
      >
        ← Todas as trilhas
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <span className="text-4xl">{track.icon}</span>
        <div>
          <h1 className="font-display font-bold text-3xl text-cream">{track.name}</h1>
          <p className="text-cream-muted">{track.tagline}</p>
        </div>
      </div>

      <ProgressPath units={track.units} completedIds={completedIds} trackId={track.id} />
    </div>
  );
}
