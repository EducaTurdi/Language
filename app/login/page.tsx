import Link from "next/link";
import Logo from "@/components/Logo";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-10">
        <Logo size="md" />
      </Link>
      <AuthForm mode="login" />
    </main>
  );
}
