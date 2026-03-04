import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import EditProfilePage from './EditProfilePage'
import ApiService from '../../service/ApiService'

// Mock navigate
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
    deleteUser: vi.fn()
  }
}))

describe('EditProfilePage', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser = {
    id: 1,
    name: 'Matias',
    email: 'matias@test.com',
    phoneNumber: '123456789'
  }

  test('renderiza datos del usuario', async () => {

    ApiService.getUserProfile.mockResolvedValue({
      user: mockUser
    })

    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Nombre:/i))
        .toBeInTheDocument()
    })

    expect(screen.getByText('Matias'))
      .toBeInTheDocument()

    expect(screen.getByText('matias@test.com'))
      .toBeInTheDocument()
  })

  test('muestra error si falla getUserProfile', async () => {

    ApiService.getUserProfile.mockRejectedValue(
      new Error('Error al cargar perfil')
    )

    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar perfil/i))
        .toBeInTheDocument()
    })
  })

  test('no elimina si el usuario cancela confirm', async () => {

    ApiService.getUserProfile.mockResolvedValue({
      user: mockUser
    })

    // Mock confirm -> false
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>
    )

    await waitFor(() =>
      screen.getByText(/Eliminar perfil/i)
    )

    fireEvent.click(screen.getByText(/Eliminar perfil/i))

    expect(ApiService.deleteUser).not.toHaveBeenCalled()
  })

  test('elimina perfil y navega a signup si confirma', async () => {

    ApiService.getUserProfile.mockResolvedValue({
      user: mockUser
    })

    ApiService.deleteUser.mockResolvedValue({})

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>
    )

    await waitFor(() =>
      screen.getByText(/Eliminar perfil/i)
    )

    fireEvent.click(screen.getByText(/Eliminar perfil/i))

    await waitFor(() => {
      expect(ApiService.deleteUser).toHaveBeenCalledWith(1)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/signup')
  })

  test('muestra error si deleteUser falla', async () => {

    ApiService.getUserProfile.mockResolvedValue({
      user: mockUser
    })

    ApiService.deleteUser.mockRejectedValue(
      new Error('Error al eliminar')
    )

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>
    )

    await waitFor(() =>
      screen.getByText(/Eliminar perfil/i)
    )

    fireEvent.click(screen.getByText(/Eliminar perfil/i))

    await waitFor(() => {
      expect(screen.getByText(/Error al eliminar/i))
        .toBeInTheDocument()
    })
  })

})