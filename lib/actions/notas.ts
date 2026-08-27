"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function atualizarNota(formData: FormData) {
  const supabase = createClient();

  const aluno_id = String(formData.get("aluno_id") ?? "");
  const disciplina = String(formData.get("disciplina") ?? "").trim();
  const professor = String(formData.get("professor") ?? "").trim() || null;
  const parse = (v: FormDataEntryValue | null) => (v === null || v === "" ? null : Number(v));

  if (!aluno_id || !disciplina) return;

  await supabase.from("notas").upsert(
    {
      aluno_id,
      disciplina,
      professor,
      b1: parse(formData.get("b1")),
      b2: parse(formData.get("b2")),
      b3: parse(formData.get("b3")),
      b4: parse(formData.get("b4")),
    },
    { onConflict: "aluno_id,disciplina" }
  );

  revalidatePath("/painel/turma/notas");
  revalidatePath("/painel/aluno/notas");
}
