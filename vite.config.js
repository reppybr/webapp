import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url' // 👈 1. Importe os helpers de URL

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 👇 2. Adicione este bloco 'resolve'
  resolve: {
    alias: {
      // 3. Defina o alias '@'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})