import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],

  server: {
    proxy: {
      "/chat": VITE_API_BASE_URL,
      "/conversations": VITE_API_BASE_URL,
      "/history": VITE_API_BASE_URL,
      "/upload": VITE_API_BASE_URL,
    },
  }
})
