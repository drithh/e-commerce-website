/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ['"Allerta-Stencil-Regular"', "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
      colors: {
        "gray-100": "#EEEEEE",
        "gray-200": "#ECECEC",
        "gray-300": "#C1C1C1",
        "gray-400": "#686868",
        "gray-500": "#282828",
      },
    },
  },
  plugins: [],
};
