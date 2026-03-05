import { describe, test, expect } from 'vitest'

/**
 * Suite de tests para main.jsx
 * - Verifica que la aplicación se monte correctamente en el DOM
 */
describe('main.jsx', () => {

  /**
   * Test: montaje de la app
   * - Crea un div con id "root" simulado en el DOM
   * - Importa dinámicamente main.jsx
   * - Verifica que el root exista después del renderizado
   */
  test('monta la aplicación sin errores', async () => {
    // Crear div simulado para el render
    const rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)

    // Import dinámico de main.jsx para ejecutar el render
    await import('./main.jsx')

    // Verifica que el div "root" existe en el DOM
    expect(document.getElementById('root')).toBeTruthy()
  })
})