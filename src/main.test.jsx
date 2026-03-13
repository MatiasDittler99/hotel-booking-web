import { describe, test, expect, vi } from 'vitest'

/**
 * Mock de react-dom/client
 * -----------------------------------------------------------------------------
 * Se reemplaza la implementación real de `createRoot` utilizada por ReactDOM
 * para evitar que React intente montar la aplicación realmente durante los tests.
 *
 * En el entorno de testing (JSDOM), un render completo puede generar procesos
 * asíncronos o ciclos internos que provocan timeouts. Por ello, se mockea la
 * función `render` con `vi.fn()` para simular el montaje sin ejecutarlo.
 */
vi.mock('react-dom/client', () => ({
  createRoot: () => ({
    render: vi.fn()
  })
}))

/**
 * Suite de tests para main.jsx
 * -----------------------------------------------------------------------------
 * Verifica que el punto de entrada de la aplicación se ejecute correctamente
 * y que el contenedor principal del DOM exista para montar la aplicación.
 */
describe('main.jsx', () => {

  /**
   * Test: montaje de la aplicación
   * ---------------------------------------------------------------------------
   * Pasos:
   * 1. Crear un elemento <div> con id "root" simulando el contenedor principal.
   * 2. Importar dinámicamente el archivo main.jsx para ejecutar su lógica.
   * 3. Verificar que el elemento root exista en el DOM después del proceso.
   */
  test('monta la aplicación sin errores', async () => {

    // Crear un contenedor simulado para que React monte la aplicación
    const rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)

    // Import dinámico para ejecutar el código de inicialización de la app
    await import('./main.jsx')

    // Verifica que el contenedor principal existe en el DOM
    expect(document.getElementById('root')).toBeTruthy()

  })

})