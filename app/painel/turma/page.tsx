import { createClient } from "@/lib/supabase/server";
import { turmaSelecionada } from "@/lib/data/professor";
import SeletorTurma from "@/components/SeletorTurma";
import Mascot from "@/components/Mascot";
import { mesAtual, nomesMeses } from "@/lib/utils";

export default async function PainelTurmaPage({
  searchParams,
}: {
  searchParams: { turma?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { turmas, atual } = await turmaSelecionada(user!.id, searchParams.turma);

  if (!atual) {
    return (
      <div className="card p-8 text-center">
        <Mascot mood="idle" size={80} className="mx-auto mb-4" />
        <p className="text-ink/60 dark:text-paper/60">
          Você ainda não está vinculado a nenhuma turma. Peça para o admin ou
          colaborador da escola te vincular em Turmas.
        </p>
      </div>
    );
  }

  const { data: matriculas } = await supabase
    .from("aluno_turmas")
    .select("aluno_id")
    .eq("turma_id", atual.id);

  const { ano, mes } = mesAtual();
  const { data: desempenho } = await supabase
    .from("desempenho_mensal")
    .select("*")
    .eq("turma_id", atual.id)
    .eq("ano", ano)
    .eq("mes", mes);

  const emAlerta = (desempenho ?? []).filter((d) => d.status !== "em_dia").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Mascot mood="happy" size={64} />
          <div>
            <h1 className="font-display font-bold text-2xl">{atual.nome}</h1>
            <p className="text-ink/60 dark:text-paper/60 text-sm">
              {atual.nivel} · {atual.periodo}
              {atual.nivel_ingles ? ` · Inglês ${atual.nivel_ingles}` : ""}
            </p>
          </div>
        </div>
        <SeletorTurma turmas={turmas} atualId={atual.id} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <p className="text-2xl mb-1">🎓</p>
          <p className="font-display font-bold text-xl">{matriculas?.length ?? 0}</p>
          <p className="text-xs text-ink/50 dark:text-paper/50">Alunos</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-2xl mb-1">⚠️</p>
          <p className="font-display font-bold text-xl">{emAlerta}</p>
          <p className="text-xs text-ink/50 dark:text-paper/50">
            Abaixo da meta em {nomesMeses[mes - 1]}
          </p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-2xl mb-1">🌎</p>
          <p className="font-display font-bold text-xl">{atual.nivel_ingles ?? "—"}</p>
          <p className="text-xs text-ink/50 dark:text-paper/50">Nível de inglês</p>
        </div>
      </div>
    </div>
  );
}
