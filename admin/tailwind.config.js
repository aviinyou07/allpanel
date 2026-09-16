/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        sidebar: {
          bg: '#0f172a',
          hover: '#1e293b',
          active: '#3b82f6',
          text: '#94a3b8',
          'text-active': '#ffffff',
        },
        admin: {
          bg: '#f8fafc',
          card: '#ffffff',
          primary: '#3b82f6',
          'primary-hover': '#2563eb',
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          'text-primary': '#1e293b',
          'text-secondary': '#64748b',
          border: '#e2e8f0',
        }
      }
    },
  },
  plugins: [],
};
