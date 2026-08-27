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

  const { alvo_id } = (await request.json()) as { alvo_id: string };
  if (!alvo_id) {
    return NextResponse.json({ erro: "Usuário não informado." }, { status: 400 });
  }

  const { data: quemChama } = await supabase
    .from("profiles")
    .select("tipo, escola_id")
    .eq("id", user.id)
    .single();

  if (!quemChama) {
    return NextResponse.json({ erro: "Perfil não encontrado." }, { status: 403 });
  }

  // Confere permissão: o alvo precisa estar dentro do que o RLS já deixaria
  // este usuário enxergar (mesma regra de "profiles" do schema).
  const { data: alvo } = await supabase
    .from("profiles")
    .select("id, escola_id, tipo")
    .eq("id", alvo_id)
    .maybeSingle();

  if (!alvo) {
    return NextResponse.json({ erro: "Sem permissão para redefinir esta senha." }, { status: 403 });
  }

  const senha = gerarSenhaTemporaria();
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(alvo_id, { password: senha });

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }

  return NextResponse.json({ senha });
}
