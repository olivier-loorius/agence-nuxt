import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    fontFamily: {
      manrope: ["Manrope", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EAB308",
          foreground: "#0A0A0A",
        },
        accent: {
          DEFAULT: "#550C18",
        },
        cta: {
          DEFAULT: "#be5241",
          foreground: "#ffffff",
          50: "#f8eeec",
          100: "#f1ddd9",
          200: "#e3bbb3",
          300: "#d5998d",
          400: "#c77767",
          500: "#b95541",
          600: "#be5241",
          700: "#a63d2e",
          800: "#8e3326",
          900: "#76291e",
          950: "#3d140f",
        },
        success: "#10B981",
        destructive: "#EF4444",
        neutral: {
          50: "#F5F5F5",
          900: "#0A0A0A",
          800: "#1F1F1F",
        },
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
        "3xl": "6rem",
        "4xl": "8rem",
        "5xl": "10rem",
        section: "5rem",
        "section-mobile": "3rem",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        hard: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.5rem",
        md: "0.375rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          md: "1.5rem",
          lg: "2rem",
          xl: "3rem",
          "2xl": "4rem",
        },
        screens: {
          xs: "100%",
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
