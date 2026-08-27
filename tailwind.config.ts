import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fossil: { DEFAULT: "#FF6B4A", dark: "#E1502F", light: "#FF8F73" },
        amber: { DEFAULT: "#FFB84D", light: "#FFD08A" },
        seafoam: { DEFAULT: "#4FD1AE", dark: "#2FA98A", light: "#8CEBD1" },
        ink: {
          DEFAULT: "#0F1B22",
          soft: "#152731",
          card: "#1B2E38",
          border: "#26404C",
        },
        paper: {
          DEFAULT: "#F6F3EC",
          soft: "#EDE8DC",
          card: "#FFFFFF",
          border: "#E1D9C7",
        },
      },
      fontFamily: {
        display: ["var(--font-baloo)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: { pop: "0 6px 0 0 rgba(0,0,0,0.18)" },
      keyframes: {
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(0.1)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px) rotate(-1deg)" },
          "50%": { transform: "translateY(-8px) rotate(1deg)" },
        },
      },
      animation: {
        blink: "blink 5s infinite",
        floaty: "floaty 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
