/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EBF4',
          100: '#C2D0E5',
          200: '#9AB0D5',
          300: '#7290C5',
          400: '#5677B6',
          500: '#3A5CA6',
          600: '#2E4A85',
          700: '#233764',
          800: '#1A2B4A',
          900: '#121D33',
        },
        neutral: {
          50: '#F7F7F8',
          100: '#EEEEF0',
          200: '#D9D9DC',
          300: '#C4C4C9',
          400: '#AFAFB5',
          500: '#9A9AA2',
          600: '#7E7E88',
          700: '#63636D',
          800: '#494952',
          900: '#2E2E38',
        },
        accent: {
          50: '#F2EFFC',
          100: '#E5DFF9',
          200: '#CABEF4',
          300: '#B09DEE',
          400: '#957DE8',
          500: '#7B5CE2',
          600: '#6D5ACF',
          700: '#5A47AB',
          800: '#473587',
          900: '#342663',
        }
      }
    },
  },
  plugins: [],
}