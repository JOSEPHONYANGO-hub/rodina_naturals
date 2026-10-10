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
        // ── Eloria Beauty brand tokens ──────────────────────────────────
        // Primary dark  – espresso/chocolate (replaces maroon)
        espresso: "#3C1A08",
        espressoDark: "#240E03",
        // Warm mid-tone – chestnut brown accent
        chestnut: "#7D4A2A",
        chestnutDark: "#5E3318",
        // Accent highlight – honey gold
        gold: "#C8A97A",
        goldDeep: "#A8854A",
        // Light surfaces – warm cream & ivory
        cream: "#F5EDE0",
        ivory: "#FDFAF5",
        // Soft warm neutrals (borders, hover fills)
        sand: "#D4B896",
        blush: "#E8D9C8",
        // Text
        ink: "#1E0E06",
        muted: "#7A5C42",
        // Legacy aliases kept so existing class-names compile without error
        // (progressively replaced in Phase 3)
        maroon: "#3C1A08",
        maroonDark: "#240E03",
        charcoal: "#1E0E06",
        brandPurple: "#7D4A2A",
        brandPurpleDark: "#5E3318",
        rose: "#E8D9C8",
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
