/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        felt: {
          700: '#1a5c2a',
          800: '#145222',
          900: '#0e3b18'
        },
        gold: {
          400: '#f6c643',
          500: '#e5a00d'
        }
      },
      fontFamily: {
        poker: ['Georgia', 'serif']
      }
    }
  },
  plugins: []
}
