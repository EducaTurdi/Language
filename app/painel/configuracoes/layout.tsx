import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/configuracoes/icon.svg" },
};

export default function ConfiguracoesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
