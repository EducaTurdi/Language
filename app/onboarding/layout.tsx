import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: { icon: "/onboarding/icon.svg" },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
