import { createClient } from "@/lib/supabase/server";
import Mascot from "@/components/Mascot";

export default async function AdminOverviewPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("profiles")
    .select("tipo, nome")
    .eq("id", user?.id ?? "")
    .single();

  const [{ count: escolas }, { count: turmas }, { count: professores }, { count: alunos }] =
    await Promise.all([
      supabase.from("escolas").select("*", { count: "exact", head: true }),
      supabase.from("turmas").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("tipo", "professor"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("tipo", "aluno"),
    ]);

  const { data: comunicados } = await supabase
    .from("comunicados")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Mascot mood="happy" size={64} />
        <div>
          <h1 className="font-display font-bold text-2xl">Olá, {perfil?.nome}!</h1>
          <p className="text-ink/60 dark:text-paper/60 text-sm">
            {perfil?.tipo === "admin"
              ? "Visão geral de toda a plataforma."
              : "Visão geral da sua escola."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {perfil?.tipo === "admin" && <StatCard emoji="🏫" label="Escolas" value={escolas ?? 0} />}
        <StatCard emoji="🗂️" label="Turmas" value={turmas ?? 0} />
        <StatCard emoji="🧑‍🏫" label="Professores" value={professores ?? 0} />
        <StatCard emoji="🎓" label="Alunos" value={alunos ?? 0} />
      </div>

      <div className="card p-6">
        <h2 className="font-display font-bold mb-4">Comunicados recentes</h2>
        {!comunicados || comunicados.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-paper/50">Nenhum comunicado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {comunicados.map((c) => (
              <li key={c.id} className="border-b border-paper-border dark:border-ink-border last:border-0 pb-3 last:pb-0">
                <p className="font-semibold text-sm">{c.titulo}</p>
                <p className="text-sm text-ink/60 dark:text-paper/60">{c.conteudo}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value }: { emoji: string; label: string; value: number }) {
  return (
    <div className="card p-5 text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <p className="font-display font-bold text-xl">{value}</p>
      <p className="text-ink/50 dark:text-paper/50 text-xs">{label}</p>
    </div>
  );
}
