import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './Guard'
import ApiService from './ApiService'

// Mock del servicio de autenticación
vi.mock('./ApiService', () => ({
  default: {
    isAuthenticated: vi.fn(),
    isAdmin: vi.fn(),
  },
}))

/**
 * Suite de tests para ProtectedRoute
 * - Verifica comportamiento condicional según estado de autenticación
 */
describe('ProtectedRoute', () => {

  /**
   * Caso: usuario autenticado
   * - Debe renderizar el componente protegido
   */
  test('renderiza el componente si está autenticado', () => {
    ApiService.isAuthenticated.mockReturnValue(true)

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route
            path="/profile"
            element={<ProtectedRoute element={<div>Contenido protegido</div>} />}
          />
        </Routes>
      </MemoryRouter>
    )

    // Verifica que el contenido protegido sea visible
    expect(screen.getByText('Contenido protegido'))
      .toBeInTheDocument()
  })

  /**
   * Caso: usuario NO autenticado
   * - Debe redirigir a la página de login
   * - Se incluye ruta de login en el router para testear la navegación
   */
  test('redirige a login si NO está autenticado', () => {
    ApiService.isAuthenticated.mockReturnValue(false)

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route
            path="/profile"
            element={<ProtectedRoute element={<div>Contenido protegido</div>} />}
          />
          <Route path="/login" element={<div>Página Login</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Verifica que la ruta protegida redirija correctamente
    expect(screen.getByText('Página Login'))
      .toBeInTheDocument()
  })
})