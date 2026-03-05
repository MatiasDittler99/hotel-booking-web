import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import HomePage from './HomePage'

// 🔹 Mock del componente RoomSearch
vi.mock('../common/RoomSearch', () => ({
  default: ({ handleSearchResult }) => (
    // Simulamos un botón que llama a handleSearchResult con datos de prueba
    <button onClick={() => handleSearchResult([{ id: 1, name: 'Suite Test' }])}>
      Buscar habitaciones
    </button>
  )
}))

// 🔹 Mock del componente RoomResult
vi.mock('../common/RoomResult', () => ({
  default: ({ roomSearchResults }) => (
    <div>
      {roomSearchResults.length > 0
        ? `Resultados: ${roomSearchResults[0].name}`  // Muestra el resultado si hay habitaciones
        : 'Sin resultados'}                            // Mensaje inicial si no hay resultados
    </div>
  )
}))

describe('HomePage', () => {

  beforeEach(() => {
    vi.clearAllMocks()  // Limpiamos los mocks antes de cada test para evitar contaminación
  })

  test('renderiza textos principales', () => {
    render(<HomePage />)

    // Verifica que el título principal se renderiza correctamente
    expect(
      screen.getByRole('heading', { name: /Bienvenido a/i })
    ).toBeInTheDocument()

    // Verifica que la sección de servicios se renderiza
    expect(
      screen.getByRole('heading', { name: /Servicios en/i })
    ).toBeInTheDocument()
  })

  test('renderiza link a todas las habitaciones', () => {
    render(<HomePage />)

    // Verifica que el link a "Todas las habitaciones" exista y tenga el href correcto
    const link = screen.getByRole('link', {
      name: /Todas las habitaciones/i
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/rooms')
  })

  test('muestra resultados cuando RoomSearch envía datos', () => {
    render(<HomePage />)

    // 🔹 Estado inicial: no hay resultados
    expect(screen.getByText(/Sin resultados/i))
      .toBeInTheDocument()

    // 🔹 Simulamos la acción de búsqueda desde RoomSearch
    fireEvent.click(
      screen.getByRole('button', { name: /Buscar habitaciones/i })
    )

    // 🔹 Verificamos que los resultados de prueba se muestren correctamente
    expect(
      screen.getByText(/Resultados: Suite Test/i)
    ).toBeInTheDocument()
  })

})