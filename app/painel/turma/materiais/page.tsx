import { createClient } from "@/lib/supabase/server";
import { turmaSelecionada } from "@/lib/data/professor";
import SeletorTurma from "@/components/SeletorTurma";
import { criarApostila, criarResumo } from "@/lib/actions/materiais";

export default async function MateriaisProfessorPage({
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

  const [{ data: apostilas }, { data: resumos }] = await Promise.all([
    supabase.from("apostilas").select("*").contains("turmas", [atual.id]).order("created_at", { ascending: false }),
    supabase.from("resumos").select("*").contains("turmas", [atual.id]).order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display font-bold text-2xl">Materiais · {atual.nome}</h1>
        <SeletorTurma turmas={turmas} atualId={atual.id} />
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <form action={criarApostila} className="card p-6">
          <h2 className="font-display font-bold mb-4">Nova apostila</h2>
          <input type="hidden" name="turma_id" value={atual.id} />
          <div className="space-y-3 mb-3">
            <input name="titulo" placeholder="Título" required className="input" />
            <input name="disciplina" placeholder="Disciplina (opcional)" className="input" />
            <input name="arquivo_url" placeholder="Link do arquivo (Drive, PDF...)" className="input" />
            <textarea name="descricao" placeholder="Descrição (opcional)" rows={2} className="input" />
          </div>
          <button type="submit" className="btn-primary">Adicionar apostila</button>
        </form>

        <form action={criarResumo} className="card p-6">
          <h2 className="font-display font-bold mb-4">Novo resumo</h2>
          <input type="hidden" name="turma_id" value={atual.id} />
          <div className="space-y-3 mb-3">
            <input name="titulo" placeholder="Título" required className="input" />
            <input name="disciplina" placeholder="Disciplina (opcional)" className="input" />
            <input name="arquivo_url" placeholder="Link do arquivo (Drive, PDF...)" className="input" />
            <textarea name="descricao" placeholder="Descrição (opcional)" rows={2} className="input" />
          </div>
          <button type="submit" className="btn-secondary">Adicionar resumo</button>
        </form>
      </div>

      <ListaMateriais titulo="Apostilas" itens={apostilas ?? []} />
      <ListaMateriais titulo="Resumos" itens={resumos ?? []} />
    </div>
  );
}

function ListaMateriais({ titulo, itens }: { titulo: string; itens: any[] }) {
  return (
    <div className="mb-8">
      <h2 className="font-display font-bold mb-3">{titulo}</h2>
      {itens.length === 0 ? (
        <p className="text-sm text-ink/50 dark:text-paper/50">Nada por aqui ainda.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {itens.map((item) => (
            <a
              key={item.id}
              href={item.arquivo_url ?? "#"}
              target={item.arquivo_url ? "_blank" : undefined}
              className="card p-4 hover:border-seafoam transition-colors"
            >
              <p className="font-semibold text-sm">{item.emoji ?? "📝"} {item.titulo}</p>
              {item.disciplina && <p className="text-xs text-ink/50 dark:text-paper/50">{item.disciplina}</p>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
