/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#cce2ff',
        surface: '#ffffff',
        'surface-2': '#eef5ff',
        ink: '#344a57',
        'ink-dim': '#5c7185',
        accent: '#5681bd',
        good: '#2f9e6e',
        bad: '#d9636f',
        'topic-maa6': '#7c6fdc',
        'topic-maa5': '#2f9baa',
        'topic-maa7': '#d98a3d',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
