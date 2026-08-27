"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CriarUsuarioForm({
  tipos,
  turmas,
  escolas,
  mostrarEscola,
}: {
  tipos: { value: string; label: string }[];
  turmas: { id: string; nome: string }[];
  escolas: { id: string; nome: string }[];
  mostrarEscola: boolean;
}) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState(tipos[0]?.value ?? "aluno");
  const [turmaId, setTurmaId] = useState("");
  const [escolaId, setEscolaId] = useState("");
  const [cargo, setCargo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{ erro?: string; senha?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    const res = await fetch("/api/admin/criar-usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        email,
        tipo,
        turma_id: turmaId || undefined,
        escola_id: escolaId || undefined,
        cargo: cargo || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    setResultado(data);
    if (data.senha) {
      setNome("");
      setEmail("");
      setTurmaId("");
      setCargo("");
      router.refresh();
    }
  }

  return (
    <div className="card p-6 mb-8">
      <h2 className="font-display font-bold mb-4">Nova conta</h2>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3 mb-3">
        <input
          placeholder="Nome completo"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="input"
        />
        <input
          type="email"
          placeholder="E-mail"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input">
          {tipos.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {tipo === "aluno" && (
          <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} required className="input">
            <option value="">Selecione a turma</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        )}

        {tipo === "professor" && (
          <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className="input">
            <option value="">Vincular a uma turma (opcional)</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        )}

        {tipo === "colaborador" && (
          <input
            placeholder="Cargo (ex: Direção, Coordenação)"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="input"
          />
        )}

        {mostrarEscola && tipo !== "aluno" && (
          <select value={escolaId} onChange={(e) => setEscolaId(e.target.value)} className="input">
            <option value="">Escola (opcional)</option>
            {escolas.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>
        )}

        <button type="submit" disabled={loading} className="btn-primary sm:col-span-2">
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

      {resultado?.erro && (
        <p className="text-fossil-dark bg-fossil/10 border border-fossil/30 rounded-lg px-3 py-2 text-sm">
          {resultado.erro}
        </p>
      )}
      {resultado?.senha && (
        <p className="text-seafoam-dark bg-seafoam/10 border border-seafoam/30 rounded-lg px-3 py-2 text-sm">
          Conta criada! Senha temporária: <strong>{resultado.senha}</strong> — entregue essa
          senha para a pessoa. Ela poderá trocá-la em Configurações.
        </p>
      )}
    </div>
  );
}
