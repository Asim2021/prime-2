import tailwindPresetMantine from "tailwind-preset-mantine";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [tailwindPresetMantine],
  plugins: [],
  theme: {
    extend: {
      colors: {},
      boxShadow: {
        "erp-shadow": "0px 2px 4px 0px rgba(0, 0, 0, 0.2)",
        "base-shadow":
          "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
        "hov-shadow": "0 4px 8px 0px rgba(57, 67, 87, .3)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
};
export default config;
