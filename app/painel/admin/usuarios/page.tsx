import { createClient } from "@/lib/supabase/server";
import CriarUsuarioForm from "@/components/CriarUsuarioForm";
import ResetarSenhaButton from "@/components/ResetarSenhaButton";
import { rotuloTipo } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/usuarios/icon.svg" },
};

export default async function UsuariosPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = await supabase
    .from("profiles")
    .select("tipo")
    .eq("id", user?.id ?? "")
    .single();

  const [{ data: usuarios }, { data: turmas }, { data: escolas }] = await Promise.all([
    supabase.from("profiles").select("*").order("nome"),
    supabase.from("turmas").select("id, nome").order("nome"),
    perfil?.tipo === "admin" ? supabase.from("escolas").select("id, nome").order("nome") : Promise.resolve({ data: [] }),
  ]);

  const tiposDisponiveis =
    perfil?.tipo === "admin"
      ? [
          { value: "aluno", label: "Aluno" },
          { value: "professor", label: "Professor" },
          { value: "colaborador", label: "Colaborador" },
        ]
      : [
          { value: "aluno", label: "Aluno" },
          { value: "professor", label: "Professor" },
        ];

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-6">Usuários</h1>

      <CriarUsuarioForm
        tipos={tiposDisponiveis}
        turmas={turmas ?? []}
        escolas={escolas ?? []}
        mostrarEscola={perfil?.tipo === "admin"}
      />

      <div className="card p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 dark:text-paper/50 text-xs uppercase">
              <th className="p-3">Nome</th>
              <th className="p-3">Tipo</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(usuarios ?? []).map((u) => (
              <tr key={u.id} className="border-t border-paper-border dark:border-ink-border">
                <td className="p-3 font-semibold">{u.nome}</td>
                <td className="p-3 text-ink/60 dark:text-paper/60">
                  {rotuloTipo[u.tipo] ?? u.tipo}
                  {u.cargo ? ` · ${u.cargo}` : ""}
                </td>
                <td className="p-3">
                  {u.id !== user?.id && <ResetarSenhaButton alvoId={u.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
