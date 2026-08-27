import { createClient } from "@/lib/supabase/server";
import { obterTurmaDoAluno } from "@/lib/data/aluno";
import { entregarTarefa } from "@/lib/actions/tarefas";
import { formatarData } from "@/lib/utils";

export default async function TarefasAlunoPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const turma = await obterTurmaDoAluno(user!.id);
  if (!turma) return <p className="text-ink/60 dark:text-paper/60">Você ainda não está em nenhuma turma.</p>;

  const { data: tarefas } = await supabase
    .from("tarefas")
    .select("*")
    .contains("turmas", [turma.id])
    .order("prazo");

  const { data: entregas } = await supabase
    .from("entregas")
    .select("*")
    .eq("aluno_id", user?.id ?? "");

  const entregaDaTarefa = (tarefaId: string) => (entregas ?? []).find((e) => e.tarefa_id === tarefaId);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-bold text-2xl mb-6">Tarefas</h1>

      <div className="space-y-4">
        {(tarefas ?? []).map((t) => {
          const entrega = entregaDaTarefa(t.id);
          const jaEntregou = entrega && entrega.status !== "pendente";

          return (
            <div key={t.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold">{t.titulo}</p>
                  <p className="text-xs text-ink/50 dark:text-paper/50">
                    {t.disciplina ? `${t.disciplina} · ` : ""}Prazo: {formatarData(t.prazo)} · {t.pontos} pts
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    entrega?.status === "entregue"
                      ? "bg-seafoam/10 text-seafoam-dark"
                      : entrega?.status === "recusada"
                        ? "bg-fossil/10 text-fossil-dark"
                        : "bg-ink/5 dark:bg-paper/10 text-ink/50 dark:text-paper/50"
                  }`}
                >
                  {entrega?.status ?? "pendente"}
                </span>
              </div>

              {t.descricao && (
                <p className="text-sm text-ink/70 dark:text-paper/70 mb-3">{t.descricao}</p>
              )}

              {entrega?.motivo_recusa && (
                <p className="text-sm text-fossil-dark bg-fossil/10 border border-fossil/30 rounded-lg px-3 py-2 mb-3">
                  Recusada: {entrega.motivo_recusa}
                </p>
              )}

              {entrega?.nota_obtida != null && (
                <p className="text-sm font-semibold text-seafoam-dark mb-3">
                  Nota: {entrega.nota_obtida}/{t.pontos}
                </p>
              )}

              {!jaEntregou || entrega?.status === "recusada" ? (
                <form action={entregarTarefa} className="space-y-2">
                  <input type="hidden" name="tarefa_id" value={t.id} />
                  <textarea
                    name="resposta"
                    placeholder="Escreva sua resposta aqui..."
                    defaultValue={entrega?.resposta ?? ""}
                    rows={3}
                    className="input"
                  />
                  <input
                    name="arquivo_url"
                    placeholder="Link do arquivo (opcional)"
                    defaultValue={entrega?.arquivo_url ?? ""}
                    className="input"
                  />
                  <button type="submit" className="btn-primary">
                    {entrega?.status === "recusada" ? "Reenviar" : "Entregar tarefa"}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-ink/50 dark:text-paper/50">
                  Entregue em {entrega?.entregue_em ? formatarData(entrega.entregue_em) : ""}.
                </p>
              )}
            </div>
          );
        })}
        {(!tarefas || tarefas.length === 0) && (
          <p className="text-sm text-ink/50 dark:text-paper/50">Nenhuma tarefa por aqui ainda.</p>
        )}
      </div>
    </div>
  );
}
