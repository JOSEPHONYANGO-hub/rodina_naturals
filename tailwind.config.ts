import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5EDE6",
        ivory: "#FFFAF6",
        rose: "#EAD8CF",
        blush: "#D8B6AA",
        charcoal: "#241617",
        brandPurple: "#7A2C73",
        brandPurpleDark: "#5A1F55",
        maroon: "#6F1219",
        maroonDark: "#4D0C12",
        gold: "#C9A45C",
        ink: "#2F1D1E",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
