/**
 * LoginPage.test.jsx
 * -----------------------------------------------------------------------------
 * Test unitario para el componente LoginPage.
 *
 * Objetivo:
 * - Verificar que el login:
 *   1. Llame correctamente al servicio de autenticación.
 *   2. Guarde el token y el rol en localStorage.
 *   3. Redirija al usuario a la ruta esperada.
 *
 * Se mockean:
 * - useNavigate (para validar redirección)
 * - useLocation (para simular ruta protegida previa)
 * - ApiService.loginUser (para evitar llamadas reales al backend)
 */

import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

/**
 * Mock de navegación programática.
 * Permite verificar que el componente redirige correctamente
 * sin depender del router real.
 */
const mockNavigate = vi.fn();

/**
 * Mock de ubicación simulando que el usuario
 * fue redirigido desde una ruta protegida (/dashboard).
 */
const mockLocation = { 
  state: { 
    from: { pathname: '/dashboard' } 
  } 
};

/**
 * Mock parcial de react-router-dom.
 * Se conserva la implementación original excepto:
 * - useNavigate
 * - useLocation
 */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

/**
 * Mock del servicio de autenticación.
 * Se reemplaza loginUser por una función simulada.
 */
vi.mock('../../service/ApiService', () => ({
  default: { loginUser: vi.fn() },
}));

describe('LoginPage simple test', () => {

  /**
   * Antes de cada test:
   * - Se limpian todos los mocks.
   * - Se limpia localStorage para evitar contaminación entre pruebas.
   */
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  /**
   * Caso de prueba principal:
   * Verifica flujo completo de login exitoso.
   */
  it('llama a ApiService.loginUser con los datos correctos y guarda token', async () => {

    /**
     * Se define la respuesta simulada del backend.
     */
    ApiService.loginUser.mockResolvedValue({
      statusCode: 200,
      token: 'fake-token',
      role: 'admin'
    });

    /**
     * Renderizado del componente dentro de MemoryRouter.
     * Necesario para que los hooks de router funcionen correctamente.
     */
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    /**
     * Simulación de entrada de datos del usuario.
     */
    fireEvent.change(
      screen.getByLabelText(/Correo electrónico:/i), 
      { target: { value: 'juan@test.com' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Contraseña:/i), 
      { target: { value: '123456' } }
    );

    /**
     * Simulación de envío del formulario.
     */
    fireEvent.click(
      screen.getByRole('button', { name: /Iniciar sesión/i })
    );

    /**
     * Se espera a que la promesa del login se resuelva.
     * Luego se validan:
     * - Llamada correcta al API.
     * - Persistencia de credenciales.
     * - Redirección correcta.
     */
    await waitFor(() => {

      // Verificación de llamada al servicio con parámetros correctos
      expect(ApiService.loginUser).toHaveBeenCalledWith({
        email: 'juan@test.com',
        password: '123456',
      });

      // Verificación de persistencia en localStorage
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('role')).toBe('admin');

      // Verificación de redirección hacia la ruta protegida original
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });
});