import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { corrigirEntrega } from "@/lib/actions/tarefas";
import { formatarData } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/turma-tarefas/icon.svg" },
};

export default async function CorrigirTarefaPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: tarefa } = await supabase.from("tarefas").select("*").eq("id", params.id).single();
  if (!tarefa) notFound();

  const { data: matriculas } = await supabase
    .from("aluno_turmas")
    .select("aluno_id, profiles(id, nome)")
    .in("turma_id", tarefa.turmas);

  const { data: entregas } = await supabase
    .from("entregas")
    .select("*")
    .eq("tarefa_id", tarefa.id);

  const entregaPorAluno = (alunoId: string) => (entregas ?? []).find((e) => e.aluno_id === alunoId);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-bold text-2xl mb-1">{tarefa.titulo}</h1>
      <p className="text-ink/60 dark:text-paper/60 text-sm mb-8">
        Prazo: {formatarData(tarefa.prazo)} · {tarefa.pontos} pontos
      </p>

      <div className="grid gap-4">
        {(matriculas ?? []).map((m: any) => {
          const entrega = entregaPorAluno(m.aluno_id);
          return (
            <div key={m.aluno_id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">{m.profiles?.nome}</p>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
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

              {entrega ? (
                <>
                  {entrega.resposta && (
                    <p className="text-sm text-ink/70 dark:text-paper/70 mb-3 whitespace-pre-wrap">
                      {entrega.resposta}
                    </p>
                  )}
                  {entrega.arquivo_url && (
                    <a
                      href={entrega.arquivo_url}
                      target="_blank"
                      className="text-sm text-seafoam-dark underline mb-3 inline-block"
                    >
                      Ver anexo
                    </a>
                  )}
                  <form action={corrigirEntrega} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="entrega_id" value={entrega.id} />
                    <input
                      type="number"
                      name="nota_obtida"
                      defaultValue={entrega.nota_obtida ?? ""}
                      placeholder="Nota"
                      min={0}
                      max={tarefa.pontos}
                      className="input !py-1.5 !px-2 w-24 text-sm"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-ink/60 dark:text-paper/60">
                      <input type="checkbox" name="recusar" />
                      Recusar entrega
                    </label>
                    <input
                      name="motivo_recusa"
                      placeholder="Motivo (se recusar)"
                      className="input !py-1.5 !px-2 text-sm flex-1 min-w-[140px]"
                    />
                    <button type="submit" className="btn-ghost !py-1.5 !px-3 text-sm">
                      Salvar
                    </button>
                  </form>
                </>
              ) : (
                <p className="text-sm text-ink/40 dark:text-paper/40">Ainda não entregou.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
