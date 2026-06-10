/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5b21b6",
        },
        space: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7ff",
          300: "#a5baff",
          400: "#7b90ff",
          500: "#5a63ff",
          600: "#4238ff",
          700: "#3024e8",
          800: "#2820bd",
          900: "#261f95",
          950: "#161258",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
