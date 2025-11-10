import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',  // Cambiado a 5001
        changeOrigin: true
      }
    },
    hmr: {
      overlay: false
    }
  },
  css: {
    postcss: './postcss.config.js'
  }
})