import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from './ProfilePage'
import ApiService from '../../service/ApiService'

// Mock de navegación
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock ApiService
vi.mock('../../service/ApiService', () => ({
  default: {
    getUserProfile: vi.fn(),
    getUserBookings: vi.fn(),
    logout: vi.fn()
  }
}))

describe('ProfilePage', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  test('renderiza datos del usuario y reservas', async () => {

    ApiService.getUserProfile.mockResolvedValue({
      user: { id: 1 }
    })

    ApiService.getUserBookings.mockResolvedValue({
      user: mockUser
    })

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Bienvenido, Matias/i))
        .toBeInTheDocument()
    })

    expect(screen.getByText(/Correo electrónico:/i))
      .toBeInTheDocument()

    expect(screen.getByText('ABC123'))
      .toBeInTheDocument()

    expect(screen.getByText('Suite'))
      .toBeInTheDocument()
  })

  test('muestra mensaje si no hay reservas', async () => {

    ApiService.getUserProfile.mockResolvedValue({
      user: { id: 1 }
    })

    ApiService.getUserBookings.mockResolvedValue({
      user: { ...mockUser, bookings: [] }
    })

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron reservas/i))
        .toBeInTheDocument()
    })
  })

  test('muestra error si la API falla', async () => {

    ApiService.getUserProfile.mockRejectedValue({
      response: {
        data: { message: 'Error del servidor' }
      }
    })

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Error del servidor/i))
        .toBeInTheDocument()
    })
  })

  test('logout navega a home', async () => {

    ApiService.getUserProfile.mockResolvedValue({
      user: { id: 1 }
    })

    ApiService.getUserBookings.mockResolvedValue({
      user: mockUser
    })

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    await waitFor(() =>
      screen.getByText(/Cerrar sesión/i)
    )

    fireEvent.click(screen.getByText(/Cerrar sesión/i))

    expect(ApiService.logout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

})