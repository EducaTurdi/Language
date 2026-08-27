import { createClient } from "@/lib/supabase/server";
import { obterTurmaDoAluno } from "@/lib/data/aluno";

export default async function MateriaisAlunoPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const turma = await obterTurmaDoAluno(user!.id);
  if (!turma) return <p className="text-ink/60 dark:text-paper/60">Você ainda não está em nenhuma turma.</p>;

  const [{ data: apostilas }, { data: resumos }] = await Promise.all([
    supabase.from("apostilas").select("*").contains("turmas", [turma.id]).order("created_at", { ascending: false }),
    supabase.from("resumos").select("*").contains("turmas", [turma.id]).order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-6">Materiais</h1>
      <Secao titulo="Apostilas" itens={apostilas ?? []} />
      <Secao titulo="Resumos" itens={resumos ?? []} />
    </div>
  );
}

function Secao({ titulo, itens }: { titulo: string; itens: any[] }) {
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
              {item.descricao && <p className="text-xs text-ink/60 dark:text-paper/60 mt-1">{item.descricao}</p>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
