/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      display: ["Clash Display"],
      sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"],
      mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"],
    },
    extend: {
      colors: {
        dark: "#18342C",
        primary: {
          DEFAULT: "#75f862",
          50: "#eaffe6",
          100: "#d2fec9",
          200: "#a7fd99",
          300: "#75f862",
          400: "#44ed2e",
          500: "#23d30f",
          600: "#14a907",
          700: "#13800b",
          800: "#13650f",
          900: "#135611",
          950: "#033003",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}