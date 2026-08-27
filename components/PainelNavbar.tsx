"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { createClient } from "@/lib/supabase/client";
import { TipoUsuario } from "@/lib/types";

const linksPorTipo: Record<TipoUsuario, { href: string; label: string }[]> = {
  admin: [
    { href: "/painel/admin", label: "Visão geral" },
    { href: "/painel/admin/escolas", label: "Escolas" },
    { href: "/painel/admin/turmas", label: "Turmas" },
    { href: "/painel/admin/usuarios", label: "Usuários" },
  ],
  colaborador: [
    { href: "/painel/admin", label: "Visão geral" },
    { href: "/painel/admin/turmas", label: "Turmas" },
    { href: "/painel/admin/usuarios", label: "Usuários" },
  ],
  professor: [
    { href: "/painel/turma", label: "Painel da Turma" },
    { href: "/painel/turma/tarefas", label: "Tarefas" },
    { href: "/painel/turma/materiais", label: "Materiais" },
    { href: "/painel/turma/alunos", label: "Alunos" },
    { href: "/painel/turma/notas", label: "Notas" },
  ],
  aluno: [
    { href: "/painel/aluno", label: "Início" },
    { href: "/painel/aluno/tarefas", label: "Tarefas" },
    { href: "/painel/aluno/materiais", label: "Materiais" },
    { href: "/painel/aluno/notas", label: "Notas" },
  ],
};

export default function PainelNavbar({
  tipo,
  theme,
}: {
  tipo: TipoUsuario;
  theme: "light" | "dark";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  const links = linksPorTipo[tipo];

  return (
    <header className="border-b border-paper-border dark:border-ink-border sticky top-0 z-30 bg-paper/90 dark:bg-ink/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/painel">
          <Logo size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? "bg-fossil text-white"
                    : "text-ink/70 dark:text-paper/70 hover:bg-paper-soft dark:hover:bg-ink-soft"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle theme={theme} />
          <NotificationBell />
          <Link
            href="/configuracoes"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-paper-border dark:border-ink-border hover:border-seafoam transition-colors"
            aria-label="Configurações"
          >
            ⚙️
          </Link>
          <button
            onClick={handleLogout}
            className="hidden sm:inline text-sm font-semibold text-ink/60 dark:text-paper/60 hover:text-fossil transition-colors px-2"
          >
            Sair
          </button>
        </div>
      </div>

      <nav className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                active
                  ? "bg-fossil text-white"
                  : "text-ink/70 dark:text-paper/70 hover:bg-paper-soft dark:hover:bg-ink-soft"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
