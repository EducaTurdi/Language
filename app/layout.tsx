import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import MascotWidget from "@/components/MascotWidget";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EducaTurdi",
  description: "Plataforma escolar EducaTurdi — notas, tarefas, provas e materiais em um só lugar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = cookies().get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <html lang="pt-BR" className={`${baloo.variable} ${inter.variable} ${theme === "dark" ? "dark" : ""}`}>
      <body className="font-body antialiased min-h-screen">
        {children}
        <MascotWidget />
      </body>
    </html>
  );
}
