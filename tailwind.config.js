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
        'topic-maa2': '#3f9142',
        'topic-maa3': '#c1554f',
        'topic-maa4': '#4f7cac',
        'topic-maa5': '#2f9baa',
        'topic-maa6': '#7c6fdc',
        'topic-maa7': '#d98a3d',
        'topic-maa9': '#b08d2f',
        'topic-maa10': '#8a6a4f',
        'topic-maa11': '#c74f8f',
        'topic-maa12': '#6b7a99',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
