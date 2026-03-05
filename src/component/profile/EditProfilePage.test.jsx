import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import EditProfilePage from './EditProfilePage'
import ApiService from '../../service/ApiService'

// 🔹 Mock de navigate para poder testear redirecciones
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate // Devuelve nuestra función mock
  }
})

// 🔹 Mock del ApiService para no llamar al backend real
vi.mock('../../service/ApiService', () => ({
  default: {
    getUserProfile: vi.fn(),
    deleteUser: vi.fn()
  }
}))

describe('EditProfilePage', () => {

  // 🔹 Limpia todos los mocks antes de cada test
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser = {
    id: 1,
    name: 'Matias',
    email: 'matias@test.com',
    phoneNumber: '123456789'
  }

  // 🔹 Test que verifica que los datos del usuario se renderizan correctamente
  test('renderiza datos del usuario', async () => {
    ApiService.getUserProfile.mockResolvedValue({ user: mockUser })

    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>
    )

    // Espera a que se carguen los datos asincrónicos
    await waitFor(() => {
      expect(screen.getByText(/Nombre:/i)).toBeInTheDocument()
    })

    // Verifica que se muestran los valores correctos
    expect(screen.getByText('Matias')).toBeInTheDocument()
    expect(screen.getByText('matias@test.com')).toBeInTheDocument()
  })

  // 🔹 Test que verifica el manejo de error si getUserProfile falla
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
      expect(screen.getByText(/Error al cargar perfil/i)).toBeInTheDocument()
    })
  })

  // 🔹 Test que verifica que no se llama a deleteUser si el usuario cancela la confirmación
  test('no elimina si el usuario cancela confirm', async () => {
    ApiService.getUserProfile.mockResolvedValue({ user: mockUser })
    vi.spyOn(window, 'confirm').mockReturnValue(false) // Cancelación

    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText(/Eliminar perfil/i))
    fireEvent.click(screen.getByText(/Eliminar perfil/i))

    expect(ApiService.deleteUser).not.toHaveBeenCalled()
  })

  // 🔹 Test que verifica la eliminación y redirección si el usuario confirma
  test('elimina perfil y navega a signup si confirma', async () => {
    ApiService.getUserProfile.mockResolvedValue({ user: mockUser })
    ApiService.deleteUser.mockResolvedValue({})
    vi.spyOn(window, 'confirm').mockReturnValue(true) // Confirmación

    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText(/Eliminar perfil/i))
    fireEvent.click(screen.getByText(/Eliminar perfil/i))

    await waitFor(() => {
      expect(ApiService.deleteUser).toHaveBeenCalledWith(1)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/signup')
  })

  // 🔹 Test que verifica manejo de error si deleteUser falla
  test('muestra error si deleteUser falla', async () => {
    ApiService.getUserProfile.mockResolvedValue({ user: mockUser })
    ApiService.deleteUser.mockRejectedValue(new Error('Error al eliminar'))
    vi.spyOn(window, 'confirm').mockReturnValue(true) // Confirmación

    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText(/Eliminar perfil/i))
    fireEvent.click(screen.getByText(/Eliminar perfil/i))

    await waitFor(() => {
      expect(screen.getByText(/Error al eliminar/i)).toBeInTheDocument()
    })
  })

})