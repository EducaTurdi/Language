"use client";

import { useRouter } from "next/navigation";

export default function ThemeToggle({ theme }: { theme: "light" | "dark" }) {
  const router = useRouter();

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.cookie = `theme=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      aria-label="Alternar modo claro/escuro"
      className="w-10 h-10 flex items-center justify-center rounded-xl border border-paper-border dark:border-ink-border hover:border-seafoam transition-colors text-lg"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
