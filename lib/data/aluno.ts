import { createClient } from "@/lib/supabase/server";

export async function obterTurmaDoAluno(userId: string) {
  const supabase = createClient();
  const { data: matricula } = await supabase
    .from("aluno_turmas")
    .select("turma_id, turmas(*)")
    .eq("aluno_id", userId)
    .maybeSingle();

  return (matricula as any)?.turmas ?? null;
}
