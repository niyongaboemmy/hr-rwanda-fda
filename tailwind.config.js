module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#edf9ff",
          100: "#D8F2FE",
          300: "#97d0ea",
          700: "#1899D1",
          800: "#006F9F",
          900: "#005A82",
          dark: "#03a9f4",
        },
        dark: {
          100: "e5e7eb",
          800: "#1e293b",
          900: "#0f172a",
          border: "#03a9f4",
        },
        accent: {
          400: "#FEF0E0",
          800: "#F79121",
          900: "#B76103",
        },
      },
      backgroundImage: {
        "hero-pattern": "url('./assets/homepage.png')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
