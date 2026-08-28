"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Mascot from "@/components/Mascot";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const mood = error ? "sad" : loading ? "pensando" : "happy";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      setLoading(false);
      if (error) {
        setError(traduzErro(error.message));
        return;
      }
      setNotice(
        "Conta criada! Se a confirmação de e-mail estiver ativada no seu projeto, verifique sua caixa de entrada antes de entrar."
      );
      router.refresh();
      router.push("/login");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(traduzErro(error.message));
      return;
    }
    router.refresh();
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-6">
        <Mascot mood={mood} size={110} />
      </div>

      <div className="bg-night-card border border-night-border rounded-xl2 p-8 shadow-pop">
        <h1 className="font-display font-bold text-2xl text-cream mb-1">
          {mode === "login" ? "Bem-vindo de volta" : "Vamos começar sua jornada"}
        </h1>
        <p className="text-cream-muted text-sm mb-6">
          {mode === "login"
            ? "Entre com sua conta para continuar aprendendo."
            : "Crie sua conta gratuita em menos de um minuto."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-cream-muted mb-1.5">
                Como podemos te chamar?
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-night border border-night-border rounded-xl px-4 py-3 text-cream placeholder:text-cream-faint focus:border-seafoam outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-cream-muted mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="w-full bg-night border border-night-border rounded-xl px-4 py-3 text-cream placeholder:text-cream-faint focus:border-seafoam outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-cream-muted mb-1.5">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              className="w-full bg-night border border-night-border rounded-xl px-4 py-3 text-cream placeholder:text-cream-faint focus:border-seafoam outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-fossil-light bg-fossil/10 border border-fossil/30 rounded-lg px-3 py-2 text-sm">
              {error}
            </p>
          )}
          {notice && (
            <p className="text-seafoam bg-seafoam/10 border border-seafoam/30 rounded-lg px-3 py-2 text-sm">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-fossil hover:bg-fossil-dark disabled:opacity-60 text-night font-bold py-3.5 rounded-xl shadow-pop active:translate-y-1 active:shadow-none transition-all"
          >
            {loading
              ? "Carregando..."
              : mode === "login"
                ? "Entrar na plataforma"
                : "Criar minha conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-cream-muted">
          {mode === "login" ? (
            <>
              Ainda não tem conta?{" "}
              <Link href="/signup" className="text-seafoam font-semibold hover:underline">
                Cadastre-se
              </Link>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <Link href="/login" className="text-seafoam font-semibold hover:underline">
                Entrar
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function traduzErro(message: string) {
  const map: Record<string, string> = {
    "Invalid login credentials": "E-mail ou senha incorretos.",
    "User already registered": "Já existe uma conta com esse e-mail.",
    "Email not confirmed": "Confirme seu e-mail antes de entrar.",
  };
  return map[message] ?? message;
}
