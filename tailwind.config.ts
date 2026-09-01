import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#0F1B22",
          soft: "#152731",
          card: "#1B2E38",
          border: "#26404C",
        },
        fossil: {
          DEFAULT: "#FF6B4A",
          dark: "#E1502F",
          light: "#FF8F73",
        },
        amber: {
          DEFAULT: "#FFB84D",
          light: "#FFD08A",
        },
        seafoam: {
          DEFAULT: "#4FD1AE",
          dark: "#2FA98A",
          light: "#8CEBD1",
        },
        cream: {
          DEFAULT: "#F4EFE6",
          muted: "#B9C7CC",
          faint: "#7C919A",
        },
      },
      fontFamily: {
        display: ["var(--font-baloo)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        pop: "0 6px 0 0 rgba(0,0,0,0.25)",
        glow: "0 0 40px rgba(255,107,74,0.25)",
      },
      keyframes: {
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(0.1)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px) rotate(-1deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
        popIn: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        stepGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(79,209,174,0.45)" },
          "50%": { boxShadow: "0 0 0 10px rgba(79,209,174,0)" },
        },
      },
      animation: {
        blink: "blink 5s infinite",
        floaty: "floaty 4.5s ease-in-out infinite",
        popIn: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        stepGlow: "stepGlow 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
