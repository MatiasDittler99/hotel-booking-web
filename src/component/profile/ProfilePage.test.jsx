import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from './ProfilePage'
import ApiService from '../../service/ApiService'

/**
 * Mock de navegación de React Router
 * - Permite testear redirecciones sin usar un router real
 */
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

/**
 * Mock del ApiService
 * - Evita llamadas reales a la API
 * - Permite controlar las respuestas para distintos escenarios
 */
vi.mock('../../service/ApiService', () => ({
  default: {
    getUserProfile: vi.fn(),
    getUserBookings: vi.fn(),
    logout: vi.fn()
  }
}))

/**
 * Suite de tests para ProfilePage
 * - Incluye casos de éxito, error y navegación
 */
describe('ProfilePage', () => {

  // Limpia mocks antes de cada test para evitar contaminación entre pruebas
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Datos de prueba para el usuario y reservas
  const mockUser = {
    id: 1,
    name: 'Matias',
    email: 'matias@test.com',
    phoneNumber: '123456789',
    bookings: [
      {
        id: 10,
        bookingConfirmationCode: 'ABC123',
        checkInDate: '2025-01-01',
        checkOutDate: '2025-01-05',
        totalNumOfGuest: 2,
        room: {
          roomType: 'Suite',
          roomPhotoUrl: 'photo.jpg'
        }
      }
    ]
  }

  /**
   * Test principal: renderiza correctamente los datos del usuario y sus reservas
   * - Mockea las respuestas de ApiService para simular un flujo exitoso
   * - Verifica que se muestren nombre, correo y reservas
   */
  test('renderiza datos del usuario y reservas', async () => {

    ApiService.getUserProfile.mockResolvedValue({ user: { id: 1 } })
    ApiService.getUserBookings.mockResolvedValue({ user: mockUser })

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Bienvenido, Matias/i))
        .toBeInTheDocument()
    })

    // Verifica que detalles del perfil estén visibles
    expect(screen.getByText(/Correo electrónico:/i)).toBeInTheDocument()

    // Verifica que la reserva se renderice correctamente
    expect(screen.getByText('ABC123')).toBeInTheDocument()
    expect(screen.getByText('Suite')).toBeInTheDocument()
  })

  /**
   * Test para el caso donde el usuario no tiene reservas
   * - Verifica que se muestre mensaje de "No se encontraron reservas"
   */
  test('muestra mensaje si no hay reservas', async () => {

    ApiService.getUserProfile.mockResolvedValue({ user: { id: 1 } })
    ApiService.getUserBookings.mockResolvedValue({ user: { ...mockUser, bookings: [] } })

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron reservas/i)).toBeInTheDocument()
    })
  })

  /**
   * Test para manejo de errores de la API
   * - Simula un error de la API y verifica que se muestre el mensaje de error
   */
  test('muestra error si la API falla', async () => {

    ApiService.getUserProfile.mockRejectedValue({
      response: { data: { message: 'Error del servidor' } }
    })

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Error del servidor/i)).toBeInTheDocument()
    })
  })

  /**
   * Test de logout
   * - Verifica que la función logout del ApiService sea llamada
   * - Verifica que la navegación se haga correctamente hacia '/home'
   */
  test('logout navega a home', async () => {

    ApiService.getUserProfile.mockResolvedValue({ user: { id: 1 } })
    ApiService.getUserBookings.mockResolvedValue({ user: mockUser })

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    // Espera a que el botón de cerrar sesión esté disponible
    await waitFor(() => screen.getByText(/Cerrar sesión/i))

    // Simula click en botón de logout
    fireEvent.click(screen.getByText(/Cerrar sesión/i))

    // Verifica que ApiService.logout fue llamado
    expect(ApiService.logout).toHaveBeenCalled()
    // Verifica que se haya navegado a la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

})