import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Hacer que el servidor escuche en todas las interfaces
    port: 5173,       // Puerto por defecto
  }
})
