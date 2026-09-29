/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emeraldInk: {
          DEFAULT: '#064E3B',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B', // Main brand color: Emerald Ink
          950: '#022C22',
        },
        champagne: {
          DEFAULT: '#F8E7C9',
          50: '#FDFBF7',
          100: '#FAF3E7',
          200: '#F8E7C9', // Main brand secondary: Champagne
          300: '#F1D6A1',
          400: '#E9C274',
          500: '#DFAC49',
          600: '#C28D2B',
          700: '#95691C',
          800: '#6B4A15',
          900: '#432E0D',
        },
        govBlue: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          600: '#0F52BA',
          800: '#0B3B82',
          900: '#072450',
        },
        govOrange: {
          DEFAULT: '#FF9933', // Tiranga Saffron
          dark: '#E67E22',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
