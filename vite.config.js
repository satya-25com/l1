import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        journey: resolve(__dirname, 'journey.html'),
        memories: resolve(__dirname, 'memories.html'),
        gratitude: resolve(__dirname, 'gratitude.html'),
        final: resolve(__dirname, 'final.html'),
      },
    },
  },
})
