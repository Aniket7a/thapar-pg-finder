/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        thapar: {
          red: '#c41230',       // Thapar University maroon/crimson
          darkred: '#960d24',
          lightred: '#fef2f2',
          navy: '#1e293b',
          gold: '#f59e0b',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
