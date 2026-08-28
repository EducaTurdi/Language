import { notFound } from "next/navigation";
import { getLesson } from "@/lib/data/tracks";
import { createClient } from "@/lib/supabase/server";
import LessonPlayer from "@/components/LessonPlayer";

export default async function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const found = getLesson(params.lessonId);
  if (!found) notFound();
  const { track, lesson } = found;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("hearts")
    .eq("id", user?.id ?? "")
    .single();

  return (
    <LessonPlayer
      lesson={lesson}
      trackId={track.id}
      trackName={track.name}
      startHearts={profile?.hearts ?? 5}
    />
  );
}
