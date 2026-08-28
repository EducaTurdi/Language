import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, xp, streak, hearts")
    .eq("id", user.id)
    .single();

  const username = profile?.username ?? user.email?.split("@")[0] ?? "Aluno";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar
        username={username}
        xp={profile?.xp ?? 0}
        streak={profile?.streak ?? 0}
        hearts={profile?.hearts ?? 5}
      />
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
