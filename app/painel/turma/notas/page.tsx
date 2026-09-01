import { createClient } from "@/lib/supabase/server";
import { turmaSelecionada } from "@/lib/data/professor";
import SeletorTurma from "@/components/SeletorTurma";
import { atualizarNota } from "@/lib/actions/notas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/turma-notas/icon.svg" },
};

export default async function NotasProfessorPage({
  searchParams,
}: {
  searchParams: { turma?: string; disciplina?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { turmas, atual } = await turmaSelecionada(user!.id, searchParams.turma);
  if (!atual) return <p className="text-ink/60 dark:text-paper/60">Você ainda não tem uma turma vinculada.</p>;

  const disciplina = searchParams.disciplina ?? "Geral";

  const { data: matriculas } = await supabase
    .from("aluno_turmas")
    .select("aluno_id, profiles(id, nome)")
    .eq("turma_id", atual.id);

  const { data: notas } = await supabase
    .from("notas")
    .select("*")
    .eq("disciplina", disciplina)
    .in("aluno_id", (matriculas ?? []).map((m: any) => m.aluno_id));

  const notaDoAluno = (alunoId: string) => (notas ?? []).find((n) => n.aluno_id === alunoId);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display font-bold text-2xl">Notas · {atual.nome}</h1>
        <SeletorTurma turmas={turmas} atualId={atual.id} />
      </div>

      <form method="get" className="flex items-center gap-2 mb-6">
        <input type="hidden" name="turma" value={atual.id} />
        <input
          name="disciplina"
          defaultValue={disciplina}
          placeholder="Disciplina"
          className="input !py-2 !px-3 w-auto"
        />
        <button type="submit" className="btn-ghost !py-2 !px-4 text-sm">Trocar disciplina</button>
      </form>

      <div className="space-y-3">
        <div className="hidden sm:grid grid-cols-[1fr_repeat(4,64px)_80px] gap-2 px-2 text-xs font-bold uppercase text-ink/50 dark:text-paper/50">
          <span>Aluno</span>
          <span>B1</span>
          <span>B2</span>
          <span>B3</span>
          <span>B4</span>
          <span></span>
        </div>

        {(matriculas ?? []).map((m: any) => {
          const n = notaDoAluno(m.aluno_id);
          return (
            <form
              key={m.aluno_id}
              action={atualizarNota}
              className="card p-3 grid grid-cols-2 sm:grid-cols-[1fr_repeat(4,64px)_80px] gap-2 items-center"
            >
              <input type="hidden" name="aluno_id" value={m.aluno_id} />
              <input type="hidden" name="disciplina" value={disciplina} />
              <span className="font-semibold text-sm col-span-2 sm:col-span-1">{m.profiles?.nome}</span>
              {(["b1", "b2", "b3", "b4"] as const).map((campo) => (
                <input
                  key={campo}
                  type="number"
                  step="0.1"
                  name={campo}
                  defaultValue={n?.[campo] ?? ""}
                  className="input !py-1.5 !px-2 text-sm"
                />
              ))}
              <button type="submit" className="btn-ghost !py-1.5 !px-3 text-xs">Salvar</button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
