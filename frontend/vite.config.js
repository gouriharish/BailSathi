import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // During dev, forwards /api calls to your local Express backend.
      // Change the target if Person 1's server runs on a different port.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
