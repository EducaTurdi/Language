"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Mascot from "@/components/Mascot";
import ThemeToggle from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { rotuloTipo } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("nome, tipo, primeiro_acesso")
        .eq("id", user.id)
        .single();

      if (!profile?.primeiro_acesso) {
        router.push("/painel");
        return;
      }

      setNome(profile.nome ?? "");
      setTipo(profile.tipo);
      setLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ nome, primeiro_acesso: false })
      .eq("id", user.id);

    router.refresh();
    router.push("/painel");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Mascot mood="idle" size={90} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <Logo size="md" />
      <div className="flex justify-center my-6">
        <Mascot mood="excited" size={130} floaty />
      </div>

      <div className="w-full max-w-md card p-8 text-center">
        <h1 className="font-display font-bold text-2xl mb-1">
          Bem-vindo(a) à EducaTurdi! 🎉
        </h1>
        <p className="text-ink/60 dark:text-paper/60 text-sm mb-1">
          Sua conta de <strong>{tipo ? rotuloTipo[tipo] : ""}</strong> já está pronta.
        </p>
        <p className="text-ink/60 dark:text-paper/60 text-sm mb-6">
          Só precisamos confirmar seu nome antes de começar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold mb-1.5 text-ink/70 dark:text-paper/70">
              Como podemos te chamar?
            </label>
            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Salvando..." : "Começar a usar a EducaTurdi"}
          </button>
        </form>
      </div>
    </main>
  );
}
