import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages project site serves the app from /StrudelLearningApp/, not
  // from the domain root, so every asset URL needs that prefix in production.
  base: command === 'build' ? '/StrudelLearningApp/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
}))
