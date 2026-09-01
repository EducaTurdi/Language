import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/login/icon.svg" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
