import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6100,       // Frontend runs on http://localhost:6100
    strictPort: true, // Error instead of silently picking another port
  },
})
