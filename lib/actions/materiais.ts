"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarApostila(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const disciplina = String(formData.get("disciplina") ?? "").trim() || null;
  const turma_id = String(formData.get("turma_id") ?? "").trim();
  const arquivo_url = String(formData.get("arquivo_url") ?? "").trim() || null;

  if (!titulo || !turma_id) return;

  await supabase.from("apostilas").insert({
    titulo,
    descricao,
    disciplina,
    professor_id: user?.id,
    turmas: [turma_id],
    arquivo_url,
    emoji: "📄",
  });

  revalidatePath("/painel/turma/materiais");
}

export async function criarResumo(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const disciplina = String(formData.get("disciplina") ?? "").trim() || null;
  const turma_id = String(formData.get("turma_id") ?? "").trim();
  const arquivo_url = String(formData.get("arquivo_url") ?? "").trim() || null;

  if (!titulo || !turma_id) return;

  await supabase.from("resumos").insert({
    titulo,
    descricao,
    disciplina,
    professor_id: user?.id,
    turmas: [turma_id],
    arquivo_url,
    tipo_arquivo: "link",
  });

  revalidatePath("/painel/turma/materiais");
}
