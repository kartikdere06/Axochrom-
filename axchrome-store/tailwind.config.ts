import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0E0F12",
          900: "#14161A",
          800: "#1B1E23",
          700: "#24272E",
          600: "#2F333B",
        },
        chrome: {
          200: "#E7EAEE",
          300: "#C9CFD6",
          400: "#AAB2BC",
          500: "#8B919A",
        },
        signal: {
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
