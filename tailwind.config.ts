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
        background: "#0B0B0F",
        surface: "#12121A",
        primary: "#FF4DA6",
        "primary-light": "#FFB3D9",
        accent: "#7A5CFF",
        gold: "#C9A24D",
        text: {
          primary: "#F5F5F7",
          muted: "#B7B7C2",
        },
      },
      fontFamily: {
        sans: ["Inter", "Sarabun", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
