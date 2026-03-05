// src/component/admin/AdminPage.test.jsx

/**
 * Test Suite: AdminPage
 * ----------------------
 * Pruebas unitarias del componente AdminPage.
 * 
 * Objetivos:
 *  - Verificar obtención y renderizado del nombre del administrador.
 *  - Validar navegación programática mediante useNavigate.
 *  - Asegurar aislamiento del componente respecto a dependencias externas.
 * 
 * Estrategia:
 *  - Mock del ApiService para evitar llamadas HTTP reales.
 *  - Mock de useNavigate para interceptar redirecciones.
 *  - Uso de MemoryRouter para proveer contexto de routing en entorno de test.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPage from './AdminPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

/**
 * Mock de navegación
 * --------------------
 * Función espía que permite verificar que se llamen
 * las redirecciones correctas sin cambiar realmente la ruta.
 */
const mockNavigate = vi.fn();

/**
 * Mock parcial de react-router-dom
 * ----------------------------------
 * Se preserva el comportamiento real del router,
 * pero se reemplaza useNavigate por nuestra función mock.
 */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/**
 * Mock del ApiService
 * ----------------------
 * Se intercepta la llamada a getUserProfile
 * para controlar la respuesta y evitar dependencia del backend.
 */
vi.mock('../../service/ApiService', () => ({
  default: {
    getUserProfile: vi.fn(),
  },
}));

describe('AdminPage simple tests', () => {

  /**
   * beforeEach
   * ------------
   * - Limpia todos los mocks entre tests.
   * - Define el comportamiento por defecto del mock del perfil.
   * 
   * Esto garantiza:
   *  - Independencia entre casos de prueba.
   *  - Resultados determinísticos.
   */
  beforeEach(() => {
    vi.clearAllMocks();

    ApiService.getUserProfile.mockResolvedValue({
      user: { name: 'Admin Test' },
    });
  });

  /**
   * Test 1:
   * Verifica que el nombre del administrador
   * se obtenga desde el servicio y se renderice correctamente.
   */
  it('muestra el nombre del administrador', async () => {

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    // Espera a que se ejecute la llamada al servicio
    await waitFor(() => {
      expect(ApiService.getUserProfile).toHaveBeenCalled();
    });

    // Verifica que el nombre se muestre en pantalla
    expect(
      screen.getByText(/Bienvenido, Admin Test/i)
    ).toBeInTheDocument();
  });

  /**
   * Test 2:
   * Verifica que al hacer click en "Administrar habitaciones"
   * se invoque la navegación con la ruta correcta.
   */
  it('navega a administrar habitaciones al hacer click', async () => {

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(/Administrar habitaciones/i)
    );

    expect(mockNavigate).toHaveBeenCalledWith('/admin/manage-rooms');
  });

  /**
   * Test 3:
   * Verifica que al hacer click en "Gestionar reservas"
   * se invoque la navegación con la ruta correspondiente.
   */
  it('navega a gestionar reservas al hacer click', async () => {

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(/Gestionar reservas/i)
    );

    expect(mockNavigate).toHaveBeenCalledWith('/admin/manage-bookings');
  });

});