"use client";

import { useRouter, usePathname } from "next/navigation";

export default function SeletorTurma({
  turmas,
  atualId,
}: {
  turmas: { id: string; nome: string }[];
  atualId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  if (turmas.length <= 1) return null;

  return (
    <select
      defaultValue={atualId}
      onChange={(e) => router.push(`${pathname}?turma=${e.target.value}`)}
      className="input !py-2 !px-3 w-auto"
    >
      {turmas.map((t) => (
        <option key={t.id} value={t.id}>{t.nome}</option>
      ))}
    </select>
  );
}
