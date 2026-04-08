import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5ff",
          100: "#e0ebff",
          500: "#3b6cf5",
          600: "#2b55d4",
          700: "#1e3fa6",
          900: "#0f1f4d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
