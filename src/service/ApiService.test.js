import { describe, test, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import ApiService from './ApiService'

// Mock global de axios
vi.mock('axios')

/**
 * Suite de tests para ApiService
 * - Cubre métodos de autenticación y checkers de estado
 * - Usa mocks de axios y localStorage para aislar la lógica
 */
describe('ApiService', () => {

  /**
   * Limpieza antes de cada test
   * - Evita contaminación entre pruebas
   * - Resetea mocks y localStorage
   */
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // =============================
  // AUTH METHODS
  // =============================

  /**
   * loginUser
   * - Verifica que llame a axios.post con los datos correctos
   * - Devuelve la data mockeada correctamente
   */
  test('loginUser llama a axios.post y devuelve data', async () => {
    const mockResponse = { token: '123' }

    axios.post.mockResolvedValue({ data: mockResponse })

    const result = await ApiService.loginUser({
      email: 'test@test.com',
      password: '1234'
    })

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockResponse)
  })

  /**
   * registerUser
   * - Verifica que axios.post sea llamado correctamente
   * - Retorna la data simulada
   */
  test('registerUser llama a axios.post correctamente', async () => {
    const mockResponse = { message: 'User created' }

    axios.post.mockResolvedValue({ data: mockResponse })

    const result = await ApiService.registerUser({
      name: 'Matias'
    })

    expect(axios.post).toHaveBeenCalled()
    expect(result).toEqual(mockResponse)
  })

  // =============================
  // AUTH CHECKERS
  // =============================

  /**
   * isAuthenticated
   * - Devuelve true si existe token en localStorage
   */
  test('isAuthenticated devuelve true si hay token', () => {
    localStorage.setItem('token', 'fake-token')

    expect(ApiService.isAuthenticated()).toBe(true)
  })

  /**
   * isAuthenticated
   * - Devuelve false si no existe token
   */
  test('isAuthenticated devuelve false si no hay token', () => {
    expect(ApiService.isAuthenticated()).toBe(false)
  })

  /**
   * isAdmin
   * - Devuelve true si el rol almacenado es ADMIN
   */
  test('isAdmin devuelve true si role es ADMIN', () => {
    localStorage.setItem('role', 'ADMIN')

    expect(ApiService.isAdmin()).toBe(true)
  })

  /**
   * isAdmin
   * - Devuelve false si el rol no es ADMIN
   */
  test('isAdmin devuelve false si role no es ADMIN', () => {
    localStorage.setItem('role', 'USER')

    expect(ApiService.isAdmin()).toBe(false)
  })

  /**
   * logout
   * - Elimina token y rol del localStorage
   * - Verifica que los valores queden nulos
   */
  test('logout elimina token y role', () => {
    localStorage.setItem('token', 'abc')
    localStorage.setItem('role', 'ADMIN')

    ApiService.logout()

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('role')).toBeNull()
  })

})