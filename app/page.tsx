import Link from "next/link";
import Logo from "@/components/Logo";
import Mascot from "@/components/Mascot";

const features = [
  {
    emoji: "🌎",
    title: "Trilha de Inglês",
    text: "Do 'Hello' às primeiras conversas: cumprimentos, verbos do dia a dia, horários e mais.",
  },
  {
    emoji: "💻",
    title: "Trilha de Programação",
    text: "Lógica, variáveis, condicionais, funções e laços — os fundamentos de verdade, em JavaScript.",
  },
  {
    emoji: "🔥",
    title: "Ofensiva diária",
    text: "Uma lição por dia mantém sua sequência viva e seu progresso visível.",
  },
  {
    emoji: "❤️",
    title: "Vidas, XP e exercícios",
    text: "Múltipla escolha, digitação e organizar frases — erre, aprenda e tente de novo.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <Logo size="md" />
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-cream-muted hover:text-cream transition-colors text-sm sm:text-base font-medium px-3 py-2"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="bg-fossil hover:bg-fossil-dark text-night font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-pop active:translate-y-1 active:shadow-none transition-all text-sm sm:text-base"
          >
            Criar conta grátis
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 sm:pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-night-card border border-night-border text-seafoam text-xs font-bold tracking-wide uppercase px-3 py-1.5 rounded-full mb-6">
            Não é o EducaTurdi escolar — é outra plataforma, só sua
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight text-cream">
            O app pra aprender <span className="text-seafoam">inglês</span> e{" "}
            <span className="text-fossil">programação</span>, do zero, todo dia.
          </h1>
          <p className="mt-6 text-cream-muted text-lg leading-relaxed max-w-lg">
            EducaTurdi <em>Languages</em> é focado só em duas coisas: te
            ensinar inglês (do "Hello" à primeira conversa) e programação
            (lógica e JavaScript, do zero). Lições curtas, tipo jogo, com o
            Rex te acompanhando em cada exercício.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="bg-fossil hover:bg-fossil-dark text-night font-bold px-6 py-3.5 rounded-xl2 shadow-pop active:translate-y-1 active:shadow-none transition-all text-base"
            >
              Começar agora — é grátis
            </Link>
            <Link
              href="/login"
              className="border-2 border-night-border hover:border-seafoam text-cream font-bold px-6 py-3.5 rounded-xl2 transition-colors text-base"
            >
              Já tenho conta
            </Link>
          </div>
          <p className="mt-4 text-cream-faint text-sm">
            Sem cartão de crédito. Leva menos de um minuto.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <Mascot mood="excited" size={260} />
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-center text-cream mb-2">
          Duas trilhas. Um mesmo jeito de aprender.
        </h2>
        <p className="text-center text-cream-muted mb-12 max-w-xl mx-auto">
          Nada de administração escolar, notas ou tarefas de professor por
          aqui — é só você, o Rex, e o que você quer aprender.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-night-card border border-night-border rounded-xl2 p-6 hover:border-seafoam/60 transition-colors"
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-display font-bold text-cream text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-cream-muted text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / welcome-back style block */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-night-card border border-night-border rounded-xl2 p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-cream mb-2">
              Bem-vindo de volta 👋
            </h2>
            <p className="text-cream-muted">
              Entre com sua conta para continuar sua trilha de inglês ou
              programação e não perder sua ofensiva.
            </p>
          </div>
          <Link
            href="/login"
            className="shrink-0 bg-seafoam hover:bg-seafoam-dark text-night font-bold px-6 py-3.5 rounded-xl2 shadow-pop active:translate-y-1 active:shadow-none transition-all"
          >
            Entrar na plataforma
          </Link>
        </div>
      </section>

      <footer className="border-t border-night-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-cream-faint text-sm">
            EducaTurdi Languages © 2026 · Inglês e Programação
          </p>
        </div>
      </footer>
    </main>
  );
}
