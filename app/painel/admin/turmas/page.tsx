import { createClient } from "@/lib/supabase/server";
import {
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/turmas/icon.svg" },
};
  criarTurma,
  atualizarNivelIngles,
  vincularProfessor,
  desvincularProfessor,
} from "@/lib/actions/escolas-turmas";

const NIVEIS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default async function TurmasPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: perfil } = await supabase
    .from("profiles")
    .select("tipo, escola_id")
    .eq("id", user?.id ?? "")
    .single();

  const [{ data: turmas }, { data: escolas }, { data: professores }, { data: vinculos }] =
    await Promise.all([
      supabase.from("turmas").select("*").order("nome"),
      perfil?.tipo === "admin" ? supabase.from("escolas").select("*").order("nome") : Promise.resolve({ data: [] }),
      supabase.from("profiles").select("id, nome").eq("tipo", "professor"),
      supabase.from("turma_professores").select("*"),
    ]);

  const professoresPorTurma = (turmaId: string) =>
    (vinculos ?? [])
      .filter((v) => v.turma_id === turmaId)
      .map((v) => (professores ?? []).find((p) => p.id === v.professor_id))
      .filter(Boolean);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-6">Turmas</h1>

      <form action={criarTurma} className="card p-6 mb-8">
        <h2 className="font-display font-bold mb-4">Nova turma</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input name="id" placeholder="Código (ex: 9A-2026)" required className="input" />
          <input name="nome" placeholder="Nome (ex: 9º Ano A)" required className="input" />
          <input name="nivel" placeholder="Nível (ex: Fundamental II)" required className="input" />
          <input name="periodo" placeholder="Período (ex: Manhã)" required className="input" />
          <input name="sala" placeholder="Sala (opcional)" className="input" />
          <select name="nivel_ingles" className="input" defaultValue="">
            <option value="">Nível de inglês (opcional)</option>
            {NIVEIS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          {perfil?.tipo === "admin" && (
            <select name="escola_id" className="input" defaultValue="">
              <option value="">Escola (opcional)</option>
              {(escolas ?? []).map((e) => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>
          )}
        </div>
        <button type="submit" className="btn-primary">Criar turma</button>
      </form>

      <div className="grid gap-4">
        {(turmas ?? []).map((t) => (
          <div key={t.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <p className="font-display font-bold">{t.nome}</p>
                <p className="text-xs text-ink/50 dark:text-paper/50">
                  {t.nivel} · {t.periodo} {t.sala ? `· Sala ${t.sala}` : ""}
                </p>
              </div>
              <form action={atualizarNivelIngles} className="flex items-center gap-2">
                <input type="hidden" name="turma_id" value={t.id} />
                <select name="nivel_ingles" defaultValue={t.nivel_ingles ?? ""} className="input !py-1.5 !px-2 text-sm w-auto">
                  <option value="">Sem nível de inglês</option>
                  {NIVEIS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <button type="submit" className="btn-ghost !py-1.5 !px-3 text-sm">Salvar</button>
              </form>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {professoresPorTurma(t.id).map((p: any) => (
                <form key={p.id} action={desvincularProfessor} className="flex items-center gap-1">
                  <input type="hidden" name="turma_id" value={t.id} />
                  <input type="hidden" name="professor_id" value={p.id} />
                  <span className="bg-seafoam/10 text-seafoam-dark text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    {p.nome}
                    <button type="submit" aria-label="Remover professor" className="hover:text-fossil">✕</button>
                  </span>
                </form>
              ))}

              <form action={vincularProfessor} className="flex items-center gap-2">
                <input type="hidden" name="turma_id" value={t.id} />
                <select name="professor_id" required className="input !py-1.5 !px-2 text-sm w-auto" defaultValue="">
                  <option value="" disabled>+ vincular professor</option>
                  {(professores ?? []).map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
                <button type="submit" className="btn-ghost !py-1.5 !px-3 text-sm">Vincular</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
