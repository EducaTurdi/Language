import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PainelNavbar from "@/components/PainelNavbar";
import Mascot from "@/components/Mascot";

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

  // IMPORTANTE: nunca redirecionar para /login aqui quando o usuário já
  // está autenticado — isso cria um loop infinito (o middleware manda de
  // volta pra /painel, que cai aqui de novo). Se o perfil ainda não
  // existir na tabela profiles, mostramos um aviso em vez de redirecionar.
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-4">
        <Mascot mood="sad" size={110} />
        <h1 className="font-display font-bold text-xl">Seu perfil ainda não foi criado</h1>
        <p className="text-ink/60 dark:text-paper/60 max-w-sm text-sm">
          Sua conta de login existe, mas ainda não tem um perfil na tabela{" "}
          <code>profiles</code>. Peça para o administrador da escola te
          cadastrar, ou veja o arquivo{" "}
          <code>supabase/schema_v4_correcao_admin.sql</code> se você é o admin.
        </p>
      </div>
    );
  }

  if (profile.tipo !== "admin" && profile.primeiro_acesso) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen">
      <PainelNavbar tipo={profile.tipo} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
