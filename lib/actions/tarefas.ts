"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarTarefa(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const disciplina = String(formData.get("disciplina") ?? "").trim() || null;
  const turma_id = String(formData.get("turma_id") ?? "").trim();
  const prazo = String(formData.get("prazo") ?? "").trim();
  const pontos = Number(formData.get("pontos") ?? 10);
  const grau = String(formData.get("grau") ?? "normal");

  if (!titulo || !turma_id || !prazo) return;

  await supabase.from("tarefas").insert({
    titulo,
    descricao,
    disciplina,
    professor_id: user?.id,
    turmas: [turma_id],
    prazo,
    pontos,
    grau,
  });

  revalidatePath("/painel/turma/tarefas");
}

export async function entregarTarefa(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tarefa_id = String(formData.get("tarefa_id") ?? "");
  const resposta = String(formData.get("resposta") ?? "").trim();
  const arquivo_url = String(formData.get("arquivo_url") ?? "").trim() || null;

  if (!tarefa_id || !user) return;

  await supabase.from("entregas").upsert(
    {
      tarefa_id,
      aluno_id: user.id,
      status: "entregue",
      resposta,
      arquivo_url,
      entregue_em: new Date().toISOString(),
    },
    { onConflict: "tarefa_id,aluno_id" }
  );

  revalidatePath("/painel/aluno/tarefas");
}

export async function corrigirEntrega(formData: FormData) {
  const supabase = createClient();
  const entrega_id = String(formData.get("entrega_id") ?? "");
  const nota_obtida = Number(formData.get("nota_obtida") ?? 0);
  const recusar = formData.get("recusar") === "on";
  const motivo_recusa = String(formData.get("motivo_recusa") ?? "").trim() || null;

  if (!entrega_id) return;

  await supabase
    .from("entregas")
    .update({
      nota_obtida,
      status: recusar ? "recusada" : "entregue",
      motivo_recusa: recusar ? motivo_recusa : null,
      visto_em: new Date().toISOString(),
    })
    .eq("id", entrega_id);

  revalidatePath("/painel/turma/tarefas");
}
