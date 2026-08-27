import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { turmaSelecionada } from "@/lib/data/professor";
import SeletorTurma from "@/components/SeletorTurma";
import { criarTarefa } from "@/lib/actions/tarefas";
import { formatarData } from "@/lib/utils";

export default async function TarefasProfessorPage({
  searchParams,
}: {
  searchParams: { turma?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { turmas, atual } = await turmaSelecionada(user!.id, searchParams.turma);
  if (!atual) return <p className="text-ink/60 dark:text-paper/60">Você ainda não tem uma turma vinculada.</p>;

  const { data: tarefas } = await supabase
    .from("tarefas")
    .select("*")
    .contains("turmas", [atual.id])
    .order("prazo", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display font-bold text-2xl">Tarefas · {atual.nome}</h1>
        <SeletorTurma turmas={turmas} atualId={atual.id} />
      </div>

      <form action={criarTarefa} className="card p-6 mb-8">
        <h2 className="font-display font-bold mb-4">Nova tarefa</h2>
        <input type="hidden" name="turma_id" value={atual.id} />
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input name="titulo" placeholder="Título" required className="input sm:col-span-2" />
          <textarea name="descricao" placeholder="Descrição (opcional)" className="input sm:col-span-2" rows={2} />
          <input name="disciplina" placeholder="Disciplina (opcional)" className="input" />
          <input name="prazo" type="date" required className="input" />
          <input name="pontos" type="number" defaultValue={10} min={0} className="input" />
          <select name="grau" className="input" defaultValue="normal">
            <option value="importante">Importante</option>
            <option value="normal">Normal</option>
            <option value="opcional">Opcional</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Criar tarefa</button>
      </form>

      <div className="grid gap-3">
        {(tarefas ?? []).map((t) => (
          <Link
            key={t.id}
            href={`/painel/turma/tarefas/${t.id}`}
            className="card p-5 flex items-center justify-between hover:border-seafoam transition-colors"
          >
            <div>
              <p className="font-semibold">{t.titulo}</p>
              <p className="text-xs text-ink/50 dark:text-paper/50">
                {t.disciplina ? `${t.disciplina} · ` : ""}Prazo: {formatarData(t.prazo)} · {t.pontos} pts
              </p>
            </div>
            <span className="text-ink/40 dark:text-paper/40">→</span>
          </Link>
        ))}
        {(!tarefas || tarefas.length === 0) && (
          <p className="text-sm text-ink/50 dark:text-paper/50">Nenhuma tarefa criada ainda.</p>
        )}
      </div>
    </div>
  );
}
