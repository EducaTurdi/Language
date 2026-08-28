import Link from "next/link";
import Mascot from "@/components/Mascot";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Logo size="md" />
      <Mascot mood="sad" size={160} className="my-8" />
      <h1 className="font-display font-bold text-3xl text-cream mb-2">
        Essa página fossilizou
      </h1>
      <p className="text-cream-muted mb-8 max-w-sm">
        Não encontramos o que você procurava. Que tal voltar para suas trilhas?
      </p>
      <Link
        href="/"
        className="bg-fossil hover:bg-fossil-dark text-night font-bold px-6 py-3.5 rounded-xl2 shadow-pop active:translate-y-1 active:shadow-none transition-all"
      >
        Voltar para o início
      </Link>
    </main>
  );
}
