import { describe, test, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import ApiService from './ApiService'

vi.mock('axios')

describe('ApiService', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // =============================
  // AUTH METHODS
  // =============================

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

  test('isAuthenticated devuelve true si hay token', () => {
    localStorage.setItem('token', 'fake-token')

    expect(ApiService.isAuthenticated()).toBe(true)
  })

  test('isAuthenticated devuelve false si no hay token', () => {
    expect(ApiService.isAuthenticated()).toBe(false)
  })

  test('isAdmin devuelve true si role es ADMIN', () => {
    localStorage.setItem('role', 'ADMIN')

    expect(ApiService.isAdmin()).toBe(true)
  })

  test('isAdmin devuelve false si role no es ADMIN', () => {
    localStorage.setItem('role', 'USER')

    expect(ApiService.isAdmin()).toBe(false)
  })

  test('logout elimina token y role', () => {
    localStorage.setItem('token', 'abc')
    localStorage.setItem('role', 'ADMIN')

    ApiService.logout()

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('role')).toBeNull()
  })

})