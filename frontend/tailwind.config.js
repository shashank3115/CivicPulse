/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFBFC',
        textMain: '#1a2332',
        textSecondary: '#64748b',
        primary: '#0ea5e9',
        amberAlert: '#f59e0b',
        greenPositive: '#10b981',
        redCritical: '#ef4444',
        borderLight: '#e2e8f0',
        cardBg: '#ffffff',
        sidebarBg: '#1e293b'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
