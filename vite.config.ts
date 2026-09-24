import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { env: Record<string, string | undefined> }

export default defineConfig({
  base: process.env.CI_PAGES_BASE || '/',
  plugins: [react()],
  server: {
    host: true,
  },
})
