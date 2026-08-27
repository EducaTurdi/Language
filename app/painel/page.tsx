import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PainelIndex() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("tipo")
    .eq("id", user?.id ?? "")
    .single();

  if (profile?.tipo === "admin" || profile?.tipo === "colaborador") {
    redirect("/painel/admin");
  } else if (profile?.tipo === "professor") {
    redirect("/painel/turma");
  } else {
    redirect("/painel/aluno");
  }
}
