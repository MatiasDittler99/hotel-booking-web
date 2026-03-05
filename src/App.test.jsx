import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import App from './App'

/**
 * Suite de tests para App.js
 * - Verifica que elementos globales importantes se rendericen
 */
describe('App', () => {

  /**
   * Test: Footer
   * - Comprueba que el footer se renderice correctamente
   * - Busca específicamente el símbolo ©
   * - Útil para asegurar que la app siempre incluye el footer
   */
  test('renderiza correctamente el footer con el símbolo ©', () => {
    render(<App />) // Renderiza la app completa en un entorno de test

    // Busca el símbolo © en cualquier parte del footer
    const copyrightElement = screen.getByText(/©/)

    // Verifica que exista en el DOM
    expect(copyrightElement).toBeInTheDocument()
  })
})