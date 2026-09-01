import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/notas/icon.svg" },
};

export default async function NotasAlunoPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notas } = await supabase
    .from("notas")
    .select("*")
    .eq("aluno_id", user?.id ?? "")
    .order("disciplina");

  return (
    <div className="max-w-xl">
      <h1 className="font-display font-bold text-2xl mb-6">Boletim</h1>

      {!notas || notas.length === 0 ? (
        <p className="text-sm text-ink/50 dark:text-paper/50">Nenhuma nota lançada ainda.</p>
      ) : (
        <div className="space-y-3">
          {notas.map((n) => {
            const valores = [n.b1, n.b2, n.b3, n.b4].filter((v) => v !== null) as number[];
            const media = valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : null;
            return (
              <div key={n.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{n.disciplina}</p>
                  {media !== null && (
                    <span className="text-sm font-bold text-seafoam-dark">Média: {media.toFixed(1)}</span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  {(["b1", "b2", "b3", "b4"] as const).map((campo, i) => (
                    <div key={campo} className="bg-paper-soft dark:bg-ink-soft rounded-lg py-2">
                      <p className="text-[10px] text-ink/50 dark:text-paper/50 uppercase">B{i + 1}</p>
                      <p className="font-bold">{n[campo] ?? "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
