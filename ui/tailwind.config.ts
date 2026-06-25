import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          black: '#000000',
          cream: '#F5F3EF',
          accent: '#D94E28',
          teal: '#1A6B5D',
          gold: '#E9B44C',
          navy: '#1E293B',
          sage: '#A3B18A',
          burgundy: '#8B1E3F',
          lavender: '#D1D1F7',
          sky: '#5B84B1',
          lime: '#C5D86D',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
