import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        table: {
          green: "#004d25",
          border: "#2c5530",
        },
        number: {
          red: "#ea384c",
          black: "#000000",
        },
        chip: {
          white: "#ffffff",
          blue: "#0066cc",
          gray: "#808080",
          gold: "#ffd700",
        },
      },
      animation: {
        "chip-drop": "chipDrop 0.3s ease-out",
        "chip-hover": "chipHover 0.2s ease-in-out",
      },
      keyframes: {
        chipDrop: {
          "0%": { transform: "translateY(-20px) scale(1.1)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        chipHover: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;