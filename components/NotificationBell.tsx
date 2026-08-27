"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Notificacao } from "@/lib/types";

export default function NotificationBell() {
  const supabase = createClient();
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("notificacoes")
        .select("*")
        .eq("destinatario_id", user.id)
        .order("criado_em", { ascending: false })
        .limit(20);
      setNotificacoes(data ?? []);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  async function marcarComoLida(id: string) {
    await supabase.from("notificacoes").update({ lida: true }).eq("id", id);
    setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setAberto((a) => !a)}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-paper-border dark:border-ink-border hover:border-seafoam transition-colors"
        aria-label="Notificações"
      >
        🔔
        {naoLidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-fossil text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto card shadow-pop p-2 z-50">
          {notificacoes.length === 0 ? (
            <p className="text-sm text-ink/50 dark:text-paper/50 p-4 text-center">
              Nenhuma notificação por aqui.
            </p>
          ) : (
            notificacoes.map((n) => (
              <button
                key={n.id}
                onClick={() => marcarComoLida(n.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                  n.lida
                    ? "opacity-60"
                    : "bg-fossil/5 dark:bg-fossil/10"
                } hover:bg-paper-soft dark:hover:bg-ink-soft`}
              >
                <p className="font-semibold text-sm">{n.titulo}</p>
                <p className="text-xs text-ink/60 dark:text-paper/60">{n.mensagem}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
