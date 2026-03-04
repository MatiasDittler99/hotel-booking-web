import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import HomePage from './HomePage'

// Mock RoomSearch
vi.mock('../common/RoomSearch', () => ({
  default: ({ handleSearchResult }) => (
    <button onClick={() => handleSearchResult([{ id: 1, name: 'Suite Test' }])}>
      Buscar habitaciones
    </button>
  )
}))

// Mock RoomResult
vi.mock('../common/RoomResult', () => ({
  default: ({ roomSearchResults }) => (
    <div>
      {roomSearchResults.length > 0
        ? `Resultados: ${roomSearchResults[0].name}`
        : 'Sin resultados'}
    </div>
  )
}))

describe('HomePage', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renderiza textos principales', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', { name: /Bienvenido a/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /Servicios en/i })
    ).toBeInTheDocument()
  })

  test('renderiza link a todas las habitaciones', () => {
    render(<HomePage />)

    const link = screen.getByRole('link', {
      name: /Todas las habitaciones/i
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/rooms')
  })

  test('muestra resultados cuando RoomSearch envía datos', () => {
    render(<HomePage />)

    // Estado inicial
    expect(screen.getByText(/Sin resultados/i))
      .toBeInTheDocument()

    // Simulamos búsqueda
    fireEvent.click(
      screen.getByRole('button', { name: /Buscar habitaciones/i })
    )

    expect(
      screen.getByText(/Resultados: Suite Test/i)
    ).toBeInTheDocument()
  })

})