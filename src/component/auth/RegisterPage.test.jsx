/**
 * RegisterPage.simple.test.jsx
 * -----------------------------------------------------------------------------
 * Test unitario simplificado del componente RegisterPage.
 *
 * Objetivo:
 * - Verificar que el formulario:
 *   1. Capture correctamente los valores ingresados.
 *   2. Llame a ApiService.registerUser con los datos esperados.
 *
 * Alcance:
 * - No se valida navegación ni mensajes visuales.
 * - Se enfoca exclusivamente en la correcta invocación del servicio.
 *
 * Dependencias mockeadas:
 * - useNavigate (react-router-dom)
 * - ApiService.registerUser
 */

import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterPage from './RegisterPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

/**
 * Mock de navegación programática.
 * Permite evitar dependencias reales del router
 * y controlar efectos secundarios de redirección.
 */
const mockNavigate = vi.fn();

/**
 * Mock parcial de react-router-dom.
 * Se conserva la implementación original,
 * excepto el hook useNavigate que se reemplaza.
 */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/**
 * Mock del servicio de registro.
 * registerUser se reemplaza por una función simulada.
 */
vi.mock('../../service/ApiService', () => ({
  default: { registerUser: vi.fn() },
}));

describe('RegisterPage simple test', () => {

  /**
   * Limpieza de mocks antes de cada prueba
   * para evitar contaminación entre tests.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Caso de prueba principal:
   * Verifica que el formulario invoque correctamente
   * el servicio de registro con los datos ingresados.
   */
  it('llama a ApiService.registerUser con los datos correctos', () => {

    /**
     * Se simula una respuesta exitosa del backend.
     * (Aunque en este test no se valida el resultado,
     * se configura para mantener coherencia del flujo).
     */
    ApiService.registerUser.mockResolvedValue({ statusCode: 200 });

    /**
     * Render del componente dentro de MemoryRouter.
     * Necesario para que los hooks de routing funcionen.
     */
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    /**
     * Simulación de ingreso de datos por parte del usuario.
     */
    fireEvent.change(
      screen.getByLabelText(/Nombre:/i),
      { target: { value: 'Juan' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Correo electrónico:/i),
      { target: { value: 'juan@test.com' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Número de teléfono:/i),
      { target: { value: '1234567890' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Contraseña:/i),
      { target: { value: '123456' } }
    );

    /**
     * Simulación del envío del formulario.
     */
    fireEvent.click(
      screen.getByRole('button', { name: /Registrarse/i })
    );

    /**
     * Verificación principal del test:
     * Se comprueba que el servicio fue llamado
     * con el objeto esperado.
     */
    expect(ApiService.registerUser).toHaveBeenCalledWith({
      name: 'Juan',
      email: 'juan@test.com',
      password: '123456',
      phoneNumber: '1234567890',
    });
  });
});