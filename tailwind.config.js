/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        roof: {
          slate: '#0f172a',
          navy: '#1e293b',
          amber: '#f59e0b',
          gold: '#d97706',
          dark: '#090d16',
          card: '#162032',
          border: '#334155'
        }
      }
    },
  },
  plugins: [],
}
