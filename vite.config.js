import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ================================
// Configuración principal de Vite
// ================================
export default defineConfig({
  
  // ================================
  // Plugins
  // ================================
  plugins: [
    react(), // Soporte completo para React + Fast Refresh (HMR)
  ],

  // ================================
  // Configuración del servidor de desarrollo
  // ================================
  server: {
    open: true, // Abre automáticamente el navegador al iniciar `npm run dev`
  },

  // ================================
  // Configuración de Vitest (testing)
  // ================================
  test: {
    environment: 'jsdom',            // Simula un DOM en Node para tests de componentes React
    globals: true,                    // Permite usar `describe`, `test`, `expect` globalmente
    setupFiles: './src/setupTests.js',// Archivo donde se importan configuraciones globales de tests (ej: jest-dom)
  },

})