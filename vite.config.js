import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/psicolab/',
  plugins: [react()],
  css: {
    postcss: {}
  }
})
