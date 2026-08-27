"use client";

import { useState } from "react";
import Mascot from "@/components/Mascot";

const dicas = [
  "Dica: complete pelo menos uma tarefa por dia para bater sua meta do mês!",
  "Toque no sino para ver seus avisos.",
  "Você pode mudar entre modo claro e escuro lá em cima.",
  "Apostilas e resumos ficam na aba Materiais.",
  "Precisa trocar sua senha? Vá em Configurações.",
];

export default function MascotWidget() {
  const [aberto, setAberto] = useState(false);
  const [dica] = useState(() => dicas[Math.floor(Math.random() * dicas.length)]);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
      {aberto && (
        <div className="card shadow-pop p-4 max-w-[220px] text-sm text-ink dark:text-paper">
          <p className="font-semibold mb-1">Rex diz:</p>
          <p className="text-ink/70 dark:text-paper/70">{dica}</p>
        </div>
      )}
      <button
        onClick={() => setAberto((a) => !a)}
        aria-label="Falar com o Rex"
        className="rounded-full bg-paper-card dark:bg-ink-card border border-paper-border dark:border-ink-border shadow-pop p-1 hover:scale-105 transition-transform"
      >
        <Mascot mood={aberto ? "excited" : "happy"} size={56} floaty />
      </button>
    </div>
  );
}
