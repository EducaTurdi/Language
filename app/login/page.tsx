"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import Mascot from "@/components/Mascot";
import ThemeToggle from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mood = error ? "sad" : loading ? "idle" : "happy";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message
      );
      return;
    }
    router.refresh();
    router.push("/painel");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <Link href="/" className="mb-8">
        <Logo size="md" />
      </Link>

      <div className="flex justify-center mb-6">
        <Mascot mood={mood} size={110} />
      </div>

      <div className="w-full max-w-md card p-8">
        <h1 className="font-display font-bold text-2xl mb-1">Bem-vindo de volta 👋</h1>
        <p className="text-ink/60 dark:text-paper/60 text-sm mb-6">
          Entre com sua conta para continuar. Contas são criadas pela
          escola ou pelo administrador.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1.5 text-ink/70 dark:text-paper/70">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1.5 text-ink/70 dark:text-paper/70">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="input"
            />
          </div>

          {error && (
            <p className="text-fossil-dark bg-fossil/10 border border-fossil/30 rounded-lg px-3 py-2 text-sm">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Entrando..." : "Entrar na plataforma"}
          </button>
        </form>
      </div>
    </main>
  );
}
