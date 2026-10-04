import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // listen on all interfaces so the tunnel can reach it
    // allow the ngrok tunnel's hostname (Vite blocks unknown hosts by default)
    allowedHosts: ['configure-flight-puma.ngrok-free.dev'],
  },
})
