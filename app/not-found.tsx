import Link from "next/link";
import Mascot from "@/components/Mascot";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Logo size="md" />
      <Mascot mood="sad" size={140} className="my-8" />
      <h1 className="font-display font-bold text-3xl mb-2">Página não encontrada</h1>
      <p className="text-ink/60 dark:text-paper/60 mb-8 max-w-sm">
        Não encontramos o que você procurava.
      </p>
      <Link href="/" className="btn-primary">Voltar para o início</Link>
    </main>
  );
}
