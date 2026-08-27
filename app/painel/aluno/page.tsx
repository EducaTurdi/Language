import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { obterTurmaDoAluno } from "@/lib/data/aluno";
import Mascot from "@/components/Mascot";
import { mesAtual, nomesMeses } from "@/lib/utils";

export default async function AlunoOverviewPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("profiles")
    .select("nome")
    .eq("id", user?.id ?? "")
    .single();

  const turma = await obterTurmaDoAluno(user!.id);

  const { data: entregas } = await supabase
    .from("entregas")
    .select("tarefa_id, status")
    .eq("aluno_id", user?.id ?? "");

  const feitas = new Set((entregas ?? []).filter((e) => e.status !== "pendente").map((e) => e.tarefa_id));

  const { data: tarefas } = turma
    ? await supabase.from("tarefas").select("*").contains("turmas", [turma.id])
    : { data: [] };

  const pendentes = (tarefas ?? []).filter((t) => !feitas.has(t.id));

  const { ano, mes } = mesAtual();
  const { data: desempenho } = turma
    ? await supabase
        .from("desempenho_mensal")
        .select("*")
        .eq("aluno_id", user?.id ?? "")
        .eq("turma_id", turma.id)
        .eq("ano", ano)
        .eq("mes", mes)
        .maybeSingle()
    : { data: null };

  const { data: comunicados } = await supabase
    .from("comunicados")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Mascot mood={pendentes.length === 0 ? "excited" : "happy"} size={64} />
        <div>
          <h1 className="font-display font-bold text-2xl">Olá, {perfil?.nome}!</h1>
          <p className="text-ink/60 dark:text-paper/60 text-sm">
            {turma ? `${turma.nome} · ${turma.periodo}` : "Você ainda não está em nenhuma turma."}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-xs font-bold uppercase text-ink/50 dark:text-paper/50 mb-1">
            Tarefas pendentes
          </p>
          <p className="font-display font-bold text-3xl mb-1">{pendentes.length}</p>
          <Link href="/painel/aluno/tarefas" className="text-sm text-seafoam-dark font-semibold hover:underline">
            Ver tarefas →
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-xs font-bold uppercase text-ink/50 dark:text-paper/50 mb-1">
            Meta de {nomesMeses[mes - 1]}
          </p>
          {desempenho ? (
            <>
              <p className="font-display font-bold text-3xl mb-1">
                {desempenho.pontos_obtidos}/{desempenho.meta_pontos}
              </p>
              <p
                className={`text-sm font-semibold ${
                  desempenho.status === "em_dia" ? "text-seafoam-dark" : "text-fossil-dark"
                }`}
              >
                {desempenho.status === "em_dia" ? "Você está em dia! 🎉" : "Fique de olho — você está abaixo da meta."}
              </p>
            </>
          ) : (
            <p className="text-sm text-ink/50 dark:text-paper/50">Ainda sem dados este mês.</p>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display font-bold mb-4">Comunicados</h2>
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
