import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'   // Estilos globales y variables de tema
import App from './App.jsx'

/**
 * Punto de entrada de la aplicación React
 * - Renderiza toda la app en el div con id "root"
 * - Envuelta en StrictMode para detectar problemas y buenas prácticas
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)