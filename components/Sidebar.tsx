"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Mascot from "@/components/Mascot";
import { StreakBadge, HeartsIndicator } from "@/components/StreakBadge";
import XPBar from "@/components/XPBar";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Trilhas", icon: "🗺️" },
  { href: "/dashboard/profile", label: "Perfil", icon: "🦖" },
];

export default function Sidebar({
  username,
  xp,
  streak,
  hearts,
}: {
  username: string;
  xp: number;
  streak: number;
  hearts: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <aside className="w-full lg:w-72 shrink-0 lg:min-h-screen lg:sticky lg:top-0 bg-night-soft border-b lg:border-b-0 lg:border-r border-night-border p-6 flex flex-col gap-6">
      <Link href="/dashboard">
        <Logo size="sm" />
      </Link>

      <div className="flex items-center gap-3">
        <Mascot mood="happy" size={56} floaty={false} />
        <div>
          <p className="text-cream font-bold leading-tight">Olá, {username}!</p>
          <p className="text-cream-faint text-xs">Vamos aprender hoje?</p>
        </div>
      </div>

      <XPBar xp={xp} />

      <div className="flex gap-3">
        <StreakBadge streak={streak} />
        <HeartsIndicator hearts={hearts} />
      </div>

      <nav className="flex lg:flex-col gap-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                active
                  ? "bg-fossil text-night"
                  : "text-cream-muted hover:bg-night-card hover:text-cream"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto text-left text-cream-faint hover:text-fossil text-sm font-semibold px-4 py-2.5 transition-colors"
      >
        Sair da conta
      </button>
    </aside>
  );
}
