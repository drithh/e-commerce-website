/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['"Allerta-Stencil-Regular"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        josefin: ['Josefin Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
