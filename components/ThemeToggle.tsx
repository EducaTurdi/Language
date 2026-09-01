"use client";

import { useEffect, useState } from "react";

// Componente independente: funciona em qualquer página (pública ou não),
// sem precisar receber o tema do servidor via props. Lê o estado atual
// direto do <html>, que o layout raiz já define de acordo com o cookie.
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.cookie = `theme=${next ? "dark" : "light"}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <button
      onClick={toggle}
      aria-label="Alternar modo claro/escuro"
      className="w-10 h-10 flex items-center justify-center rounded-xl border border-paper-border dark:border-ink-border hover:border-seafoam transition-colors text-lg bg-paper-card dark:bg-ink-card"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
