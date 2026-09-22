/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0b0b12',
        surface: '#15151f',
      },
    },
  },
  plugins: [],
}
