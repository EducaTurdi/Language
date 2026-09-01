import { createClient } from "@/lib/supabase/server";
import { turmaSelecionada } from "@/lib/data/professor";
import SeletorTurma from "@/components/SeletorTurma";
import CriarUsuarioForm from "@/components/CriarUsuarioForm";
import ResetarSenhaButton from "@/components/ResetarSenhaButton";
import { mesAtual } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/alunos/icon.svg" },
};

export default async function AlunosProfessorPage({
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

  const { data: matriculas } = await supabase
    .from("aluno_turmas")
    .select("aluno_id, profiles(id, nome)")
    .eq("turma_id", atual.id);

  const { ano, mes } = mesAtual();
  const { data: desempenho } = await supabase
    .from("desempenho_mensal")
    .select("*")
    .eq("turma_id", atual.id)
    .eq("ano", ano)
    .eq("mes", mes);

  const desempenhoDoAluno = (alunoId: string) => (desempenho ?? []).find((d) => d.aluno_id === alunoId);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display font-bold text-2xl">Alunos · {atual.nome}</h1>
        <SeletorTurma turmas={turmas} atualId={atual.id} />
      </div>

      <CriarUsuarioForm
        tipos={[{ value: "aluno", label: "Aluno" }]}
        turmas={[{ id: atual.id, nome: atual.nome }]}
        escolas={[]}
        mostrarEscola={false}
      />

      <div className="card p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 dark:text-paper/50 text-xs uppercase">
              <th className="p-3">Nome</th>
              <th className="p-3">Desempenho do mês</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(matriculas ?? []).map((m: any) => {
              const d = desempenhoDoAluno(m.aluno_id);
              return (
                <tr key={m.aluno_id} className="border-t border-paper-border dark:border-ink-border">
                  <td className="p-3 font-semibold">{m.profiles?.nome}</td>
                  <td className="p-3">
                    {d ? (
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          d.status === "em_dia"
                            ? "bg-seafoam/10 text-seafoam-dark"
                            : "bg-fossil/10 text-fossil-dark"
                        }`}
                      >
                        {d.pontos_obtidos}/{d.meta_pontos} pts
                      </span>
                    ) : (
                      <span className="text-xs text-ink/40 dark:text-paper/40">Sem dados ainda</span>
                    )}
                  </td>
                  <td className="p-3">
                    <ResetarSenhaButton alvoId={m.aluno_id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
