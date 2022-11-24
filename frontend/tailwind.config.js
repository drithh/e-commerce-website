/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['"Allerta-Stencil-Regular"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
      colors: {
        'gray-100': '#EEEEEE',
        'gray-200': '#ECECEC',
        'gray-300': '#C1C1C1',
        'gray-400': '#686868',
        'gray-500': '#282828',
      },
      animation: {
        'spin-fast-once': 'zoom-spin 0.5s cubic-bezier(0.4, 0, 0.6, 1) 0.5',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'zoom-spin': {
          '0%': {
            transform: 'scale(0.5) rotate(0deg)',
          },
          '100%': {
            transform: 'scale(1) rotate(180deg)',
          },
        },
      },
    },
  },
  plugins: [],
};
