import { createClient } from "@/lib/supabase/server";
import { criarEscola } from "@/lib/actions/escolas-turmas";

export default async function EscolasPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = await supabase
    .from("profiles")
    .select("tipo")
    .eq("id", user?.id ?? "")
    .single();

  const { data: escolas } = await supabase.from("escolas").select("*").order("nome");

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-bold text-2xl mb-6">Escolas</h1>

      {perfil?.tipo === "admin" && (
        <form action={criarEscola} className="card p-6 mb-8 flex flex-col sm:flex-row gap-3">
          <input name="nome" placeholder="Nome da escola" required className="input flex-1" />
          <input name="cidade" placeholder="Cidade (opcional)" className="input flex-1" />
          <button type="submit" className="btn-primary shrink-0">
            Criar escola
          </button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {(escolas ?? []).map((e) => (
          <div key={e.id} className="card p-5">
            <p className="font-display font-bold">{e.nome}</p>
            {e.cidade && <p className="text-sm text-ink/60 dark:text-paper/60">{e.cidade}</p>}
          </div>
        ))}
        {(!escolas || escolas.length === 0) && (
          <p className="text-sm text-ink/50 dark:text-paper/50">Nenhuma escola cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}
