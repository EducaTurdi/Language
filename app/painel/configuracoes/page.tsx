"use client";

import { useState } from "react";
import Mascot from "@/components/Mascot";
import { createClient } from "@/lib/supabase/client";

export default function ConfiguracoesPage() {
  const supabase = createClient();

  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!novoEmail) return;
    setSaving(true);
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ email: novoEmail });
    setSaving(false);
    setMsg(
      error
        ? { tipo: "erro", texto: error.message }
        : { tipo: "ok", texto: "Enviamos um e-mail de confirmação para o novo endereço." }
    );
    setNovoEmail("");
  }

  async function handleSenha(e: React.FormEvent) {
    e.preventDefault();
    if (novaSenha.length < 6) {
      setMsg({ tipo: "erro", texto: "A senha precisa ter pelo menos 6 caracteres." });
      return;
    }
    if (novaSenha !== confirmaSenha) {
      setMsg({ tipo: "erro", texto: "As senhas não coincidem." });
      return;
    }
    setSaving(true);
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    setSaving(false);
    setMsg(
      error
        ? { tipo: "erro", texto: error.message }
        : { tipo: "ok", texto: "Senha atualizada com sucesso." }
    );
    setNovaSenha("");
    setConfirmaSenha("");
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4 mb-8">
        <Mascot mood="idle" size={64} />
        <div>
          <h1 className="font-display font-bold text-2xl">Configurações</h1>
          <p className="text-ink/60 dark:text-paper/60 text-sm">
            Só mexa aqui se quiser trocar seu e-mail ou senha. Não é obrigatório.
          </p>
        </div>
      </div>

      {msg && (
        <p
          className={`mb-6 text-sm rounded-lg px-3 py-2 border ${
            msg.tipo === "ok"
              ? "text-seafoam-dark bg-seafoam/10 border-seafoam/30"
              : "text-fossil-dark bg-fossil/10 border-fossil/30"
          }`}
        >
          {msg.texto}
        </p>
      )}

      <div className="card p-6 mb-6">
        <h2 className="font-display font-bold mb-4">Trocar e-mail</h2>
        <form onSubmit={handleEmail} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="novo@email.com"
            value={novoEmail}
            onChange={(e) => setNovoEmail(e.target.value)}
            className="input flex-1"
          />
          <button type="submit" disabled={saving || !novoEmail} className="btn-ghost shrink-0">
            Atualizar e-mail
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="font-display font-bold mb-4">Trocar senha</h2>
        <form onSubmit={handleSenha} className="space-y-3">
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmaSenha}
            onChange={(e) => setConfirmaSenha(e.target.value)}
            className="input"
          />
          <button type="submit" disabled={saving || !novaSenha} className="btn-ghost">
            Atualizar senha
          </button>
        </form>
      </div>
    </div>
  );
}
