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
        sand: {
          DEFAULT: "#F5F4F1",
          dark: "#E8E6E1",
        },
        ink: {
          DEFAULT: "#1A1916",
          muted: "#888780",
          border: "#D3D1C7",
        },
        cosmos: {
          DEFAULT: "#7F77DD",
          soft: "#AFA9EC",
          bg: "#EEEDFE",
        },
        organic: {
          DEFAULT: "#1D9E75",
          soft: "#5DCAA5",
          bg: "#E1F5EE",
        },
        spatial: {
          DEFAULT: "#378ADD",
          bg: "#E6F1FB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "128": "32rem",
      },
      letterSpacing: {
        widest: "0.15em",
      },
    },
  },
  plugins: [],
};

export default config;
