/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        d4bg: '#0a0908',
        d4card: '#171311',
        d4border: '#3a2e26',
        d4gold: '#d4a857',
      },
    },
  },
  plugins: [],
};
