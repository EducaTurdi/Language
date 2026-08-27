"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarEscola(formData: FormData) {
  const supabase = createClient();
  const nome = String(formData.get("nome") ?? "").trim();
  const cidade = String(formData.get("cidade") ?? "").trim() || null;
  if (!nome) return;

  await supabase.from("escolas").insert({ nome, cidade });
  revalidatePath("/painel/admin/escolas");
}

export async function criarTurma(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = await supabase
    .from("profiles")
    .select("tipo, escola_id")
    .eq("id", user?.id ?? "")
    .single();

  const id = String(formData.get("id") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const nivel = String(formData.get("nivel") ?? "").trim();
  const periodo = String(formData.get("periodo") ?? "").trim();
  const sala = String(formData.get("sala") ?? "").trim() || null;
  const nivel_ingles = String(formData.get("nivel_ingles") ?? "").trim() || null;
  const escolaFormId = String(formData.get("escola_id") ?? "").trim() || null;

  if (!id || !nome || !nivel || !periodo) return;

  // Colaborador só pode criar turma dentro da própria escola.
  const escola_id = perfil?.tipo === "admin" ? escolaFormId : perfil?.escola_id ?? null;

  await supabase.from("turmas").insert({
    id,
    nome,
    nivel,
    periodo,
    sala,
    nivel_ingles,
    escola_id,
  });
  revalidatePath("/painel/admin/turmas");
}

export async function atualizarNivelIngles(formData: FormData) {
  const supabase = createClient();
  const turma_id = String(formData.get("turma_id") ?? "");
  const nivel_ingles = String(formData.get("nivel_ingles") ?? "") || null;
  if (!turma_id) return;
  await supabase.from("turmas").update({ nivel_ingles }).eq("id", turma_id);
  revalidatePath("/painel/admin/turmas");
}

export async function vincularProfessor(formData: FormData) {
  const supabase = createClient();
  const turma_id = String(formData.get("turma_id") ?? "");
  const professor_id = String(formData.get("professor_id") ?? "");
  if (!turma_id || !professor_id) return;
  await supabase.from("turma_professores").upsert({ turma_id, professor_id, principal: true });
  revalidatePath("/painel/admin/turmas");
}

export async function desvincularProfessor(formData: FormData) {
  const supabase = createClient();
  const turma_id = String(formData.get("turma_id") ?? "");
  const professor_id = String(formData.get("professor_id") ?? "");
  if (!turma_id || !professor_id) return;
  await supabase
    .from("turma_professores")
    .delete()
    .eq("turma_id", turma_id)
    .eq("professor_id", professor_id);
  revalidatePath("/painel/admin/turmas");
}
