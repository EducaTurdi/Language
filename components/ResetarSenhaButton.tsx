"use client";

import { useState } from "react";

export default function ResetarSenhaButton({ alvoId }: { alvoId: string }) {
  const [loading, setLoading] = useState(false);
  const [senha, setSenha] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setSenha(null);
    setErro(null);
    const res = await fetch("/api/admin/resetar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alvo_id: alvoId }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.erro) setErro(data.erro);
    else setSenha(data.senha);
  }

  return (
    <div className="text-right">
      <button onClick={handleClick} disabled={loading} className="btn-ghost !py-1.5 !px-3 text-xs">
        {loading ? "Gerando..." : "Redefinir senha"}
      </button>
      {senha && <p className="text-xs text-seafoam-dark mt-1">Nova senha: {senha}</p>}
      {erro && <p className="text-xs text-fossil-dark mt-1">{erro}</p>}
    </div>
  );
}
