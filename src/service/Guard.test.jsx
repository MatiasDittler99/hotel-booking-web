import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './Guard'
import ApiService from './ApiService'

vi.mock('./ApiService', () => ({
  default: {
    isAuthenticated: vi.fn(),
    isAdmin: vi.fn(),
  },
}))

describe('ProtectedRoute', () => {

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

    expect(screen.getByText('Contenido protegido'))
      .toBeInTheDocument()
  })

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

    expect(screen.getByText('Página Login'))
      .toBeInTheDocument()
  })
})