import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { gerarSenhaTemporaria } from "@/lib/utils";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const { data: quemChama } = await supabase
    .from("profiles")
    .select("tipo, escola_id")
    .eq("id", user.id)
    .single();

  if (!quemChama || !["admin", "colaborador", "professor"].includes(quemChama.tipo)) {
    return NextResponse.json({ erro: "Sem permissão." }, { status: 403 });
  }

  const body = await request.json();
  const { nome, email, tipo, turma_id, cargo } = body as {
    nome: string;
    email: string;
    tipo: "aluno" | "professor" | "colaborador";
    turma_id?: string;
    cargo?: string;
  };

  if (!nome || !email || !tipo) {
    return NextResponse.json({ erro: "Preencha nome, e-mail e tipo." }, { status: 400 });
  }

  // Regras de quem pode criar quem
  if (quemChama.tipo === "professor" && tipo !== "aluno") {
    return NextResponse.json({ erro: "Professores só podem criar contas de aluno." }, { status: 403 });
  }
  if (quemChama.tipo === "professor" && !turma_id) {
    return NextResponse.json({ erro: "Selecione a turma do aluno." }, { status: 400 });
  }
  if (quemChama.tipo === "colaborador" && tipo === "admin") {
    return NextResponse.json({ erro: "Colaboradores não podem criar administradores." }, { status: 403 });
  }

  if (quemChama.tipo === "professor" && turma_id) {
    const { data: vinculo } = await supabase
      .from("turma_professores")
      .select("turma_id")
      .eq("turma_id", turma_id)
      .eq("professor_id", user.id)
      .maybeSingle();
    if (!vinculo) {
      return NextResponse.json({ erro: "Essa turma não é sua." }, { status: 403 });
    }
  }

  const senha = gerarSenhaTemporaria();
  const admin = createAdminClient();

  const { data: novoUsuario, error: erroCriacao } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  });

  if (erroCriacao || !novoUsuario?.user) {
    return NextResponse.json(
      { erro: erroCriacao?.message ?? "Não foi possível criar o usuário." },
      { status: 400 }
    );
  }

  const escola_id = quemChama.tipo === "admin" ? body.escola_id ?? null : quemChama.escola_id;

  const { error: erroPerfil } = await admin.from("profiles").insert({
    id: novoUsuario.user.id,
    nome,
    tipo,
    escola_id: tipo === "aluno" ? null : escola_id,
    cargo: tipo === "colaborador" ? cargo ?? null : null,
    primeiro_acesso: true,
  });

  if (erroPerfil) {
    return NextResponse.json({ erro: erroPerfil.message }, { status: 400 });
  }

  if (tipo === "aluno" && turma_id) {
    await admin.from("aluno_turmas").insert({ aluno_id: novoUsuario.user.id, turma_id });
  }
  if (tipo === "professor" && turma_id) {
    await admin.from("turma_professores").insert({ turma_id, professor_id: novoUsuario.user.id, principal: true });
  }

  return NextResponse.json({ senha });
}
