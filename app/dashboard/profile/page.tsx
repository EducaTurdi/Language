import { createClient } from "@/lib/supabase/server";
import Mascot from "@/components/Mascot";
import XPBar from "@/components/XPBar";
import { tracks } from "@/lib/data/tracks";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, xp, streak, hearts, created_at")
    .eq("id", user?.id ?? "")
    .single();

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("track_id")
    .eq("user_id", user?.id ?? "");

  const totalDone = progress?.length ?? 0;
  const totalLessonsAll = tracks.reduce(
    (acc, t) => acc + t.units.reduce((a: number, u) => a + u.lessons.length, 0),
    0
  );

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-night-card border border-night-border rounded-xl2 p-8 flex flex-col sm:flex-row items-center gap-6 mb-8">
        <Mascot mood="happy" size={100} floaty={false} />
        <div className="text-center sm:text-left">
          <h1 className="font-display font-bold text-2xl text-cream">
            {profile?.username ?? "Aluno"}
          </h1>
          <p className="text-cream-muted text-sm">{user?.email}</p>
          {memberSince && (
            <p className="text-cream-faint text-xs mt-1">
              Na EducaTurdi Languages desde {memberSince}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard emoji="⭐" label="XP total" value={profile?.xp ?? 0} />
        <StatCard emoji="🔥" label="Ofensiva" value={`${profile?.streak ?? 0} dias`} />
        <StatCard emoji="🦴" label="Lições concluídas" value={`${totalDone}/${totalLessonsAll}`} />
      </div>

      <div className="bg-night-card border border-night-border rounded-xl2 p-6">
        <h2 className="font-display font-bold text-cream mb-4">Progresso de nível</h2>
        <XPBar xp={profile?.xp ?? 0} />
      </div>
    </div>
  );
}

function StatCard({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-night-card border border-night-border rounded-xl2 p-5 text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <p className="font-display font-bold text-xl text-cream">{value}</p>
      <p className="text-cream-faint text-xs">{label}</p>
    </div>
  );
}
