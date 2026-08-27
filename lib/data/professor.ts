import { createClient } from "@/lib/supabase/server";

export async function obterTurmasDoProfessor(userId: string) {
  const supabase = createClient();
  const { data: vinculos } = await supabase
    .from("turma_professores")
    .select("turma_id")
    .eq("professor_id", userId);

  const ids = (vinculos ?? []).map((v) => v.turma_id);
  if (ids.length === 0) return [];

  const { data: turmas } = await supabase
    .from("turmas")
    .select("*")
    .in("id", ids)
    .order("nome");

  return turmas ?? [];
}

export async function turmaSelecionada(userId: string, turmaIdParam?: string) {
  const turmas = await obterTurmasDoProfessor(userId);
  const atual = turmas.find((t) => t.id === turmaIdParam) ?? turmas[0] ?? null;
  return { turmas, atual };
}
