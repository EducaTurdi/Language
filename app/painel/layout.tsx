import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PainelNavbar from "@/components/PainelNavbar";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("tipo, primeiro_acesso")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  if (profile.tipo !== "admin" && profile.primeiro_acesso) {
    redirect("/onboarding");
  }

  const theme = cookies().get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <div className="min-h-screen">
      <PainelNavbar tipo={profile.tipo} theme={theme} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
