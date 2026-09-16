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
          primary: '#3982b8',
          blue: '#3982b8',
          dark: '#204867',
        },
        all: {
          header: '#3982b8',
          search: '#296894',
          chip: '#24587d',
          nav: '#19354d',
          sports: '#3982b8',
          blueOdds: '#7cbcf6',
          pinkOdds: '#faa7ba',
          cardLabel: '#204867',
        },
        dck: {
          header: '#3982b8',
          search: '#296894',
          chip: '#24587d',
          nav: '#19354d',
          sports: '#3982b8',
          blueOdds: '#7cbcf6',
          pinkOdds: '#faa7ba',
          cardLabel: '#204867',
        }
      }
    },
  },
  plugins: [],
};
