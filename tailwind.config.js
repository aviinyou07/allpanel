/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        logo: ['Anton', 'Bebas Neue', 'Oswald', 'Impact', 'sans-serif'],
        condensed: ['Oswald', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        theme: {
          teal: '#2a9d8f',
          dark: '#264653',
        },
        dck: {
          header: '#264653',
          search: '#3a5d6a',
          chip: '#2a9d8f',
          nav: '#1f3943',
          sports: '#2a9d8f',
          blueOdds: '#7cbcf6',
          pinkOdds: '#faa7ba',
          cardLabel: '#264653',
        }
      }
    },
  },
  plugins: [],
};
