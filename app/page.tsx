import Link from "next/link";
import Logo from "@/components/Logo";
import Mascot from "@/components/Mascot";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between px-6 py-6">
        <Logo size="md" />
        <Link href="/login" className="btn-primary text-sm sm:text-base">
          Entrar na plataforma
        </Link>
      </header>

      <section className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-tight mb-6">
            Sua plataforma escolar <span className="text-fossil">completa</span>
          </h1>
          <p className="text-ink/70 dark:text-paper/70 text-lg mb-8 max-w-md">
            Acesse notas, tarefas, provas, apostilas e muito mais. Tudo em um
            só lugar, de qualquer dispositivo.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <Feature emoji="📆" text="Atividades e entregas com prazo" />
            <Feature emoji="📊" text="Boletim e desempenho em tempo real" />
            <Feature emoji="📚" text="Apostilas e resumos em um clique" />
            <Feature emoji="📣" text="Comunicados da escola" />
          </div>
          <Link href="/login" className="btn-primary inline-block">
            Entrar na plataforma
          </Link>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="card p-10 sm:p-14">
            <Mascot mood="happy" size={200} floaty />
          </div>
        </div>
      </section>

      <footer className="border-t border-paper-border dark:border-ink-border">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center text-ink/50 dark:text-paper/50 text-sm">
          EducaTurdi © 2026 · Plataforma Educacional
        </div>
      </footer>
    </main>
  );
}

function Feature({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-ink/80 dark:text-paper/80">
      <span className="text-xl">{emoji}</span>
      {text}
    </div>
  );
}
