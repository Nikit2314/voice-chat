/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
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
        success: {
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        wave: {
          '0%': { transform: 'scaleY(0.2)' },
          '50%': { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(0.2)' },
        },
      },
    },
  },
  plugins: [],
};