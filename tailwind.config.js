/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        medical: {
          bg: '#f8fafc',
          card: '#ffffff',
          primary: '#0d9488',
          accent: '#0284c7',
          softBlue: '#e0f2fe',
          softGreen: '#dcfce7',
          softRed: '#fee2e2',
          softPurple: '#f3e8ff',
          softYellow: '#fef9c3',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
