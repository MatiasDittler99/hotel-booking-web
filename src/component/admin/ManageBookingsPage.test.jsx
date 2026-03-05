/**
 * ==========================================================
 * ManageBookingsPage.test.jsx
 * ----------------------------------------------------------
 * Tests unitarios del componente ManageBookingsPage.
 *
 * Objetivos:
 * - Verificar fetch inicial de reservas
 * - Validar renderizado correcto de resultados
 * - Comprobar filtrado por código de confirmación
 * - Verificar navegación al gestionar una reserva
 *
 * Estrategia:
 * - Mock de ApiService para evitar llamadas reales
 * - Mock de useNavigate para controlar redirecciones
 * - Uso de Testing Library (enfoque comportamiento)
 * ==========================================================
 */

import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageBookingsPage from './ManageBookingsPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';


/**
 * Mock de navegación.
 * Permite verificar que el componente redirige correctamente
 * sin depender del router real.
 */
const mockNavigate = vi.fn();


/**
 * Mock parcial de react-router-dom.
 * Se mantiene la implementación real excepto useNavigate,
 * que se reemplaza por nuestra función mock.
 */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


/**
 * Mock del servicio de API.
 * Se reemplaza getAllBookings por una función simulada.
 * Esto garantiza aislamiento y velocidad en los tests.
 */
vi.mock('../../service/ApiService', () => ({
  default: {
    getAllBookings: vi.fn(),
  },
}));


describe('ManageBookingsPage unit test', () => {

  /**
   * Dataset simulado que representa la respuesta
   * esperada del backend.
   */
  const bookingsMock = [
    {
      id: 1,
      bookingConfirmationCode: 'ABC123',
      checkInDate: '2026-03-10',
      checkOutDate: '2026-03-12',
      totalNumOfGuest: 2,
    },
    {
      id: 2,
      bookingConfirmationCode: 'DEF456',
      checkInDate: '2026-03-15',
      checkOutDate: '2026-03-18',
      totalNumOfGuest: 4,
    },
    {
      id: 3,
      bookingConfirmationCode: 'GHI789',
      checkInDate: '2026-03-20',
      checkOutDate: '2026-03-22',
      totalNumOfGuest: 1,
    },
  ];


  /**
   * beforeEach:
   * - Limpia todos los mocks
   * - Define comportamiento default del servicio
   */
  beforeEach(() => {
    vi.clearAllMocks();
    ApiService.getAllBookings.mockResolvedValue({
      bookingList: bookingsMock
    });
  });


  /**
   * Test 1:
   * - Verifica fetch inicial
   * - Comprueba renderizado de todas las reservas
   * - Valida funcionalidad de filtrado
   */
  it('muestra todas las reservas y permite filtrar por código', async () => {

    const { container } = render(
      <MemoryRouter>
        <ManageBookingsPage />
      </MemoryRouter>
    );

    /**
     * Espera a que se ejecute la llamada asincrónica
     */
    await waitFor(() => {
      expect(ApiService.getAllBookings).toHaveBeenCalled();
    });

    /**
     * Verifica que todas las reservas mockeadas
     * estén renderizadas inicialmente.
     */
    bookingsMock.forEach((b) => {
      expect(
        screen.getByText(b.bookingConfirmationCode)
      ).toBeInTheDocument();
    });

    /**
     * Simulación de búsqueda parcial.
     * Se filtra por "DEF".
     */
    const input = screen.getByPlaceholderText(
      /Introduzca el número de reserva/i
    );

    fireEvent.change(input, {
      target: { value: 'DEF' }
    });

    /**
     * Se espera que:
     * - Solo una reserva permanezca visible
     * - Las demás desaparezcan del DOM
     */
    await waitFor(() => {

      const bookingItems =
        container.querySelectorAll('.booking-result-item');

      expect(bookingItems.length).toBe(1);

      expect(screen.getByText('DEF456')).toBeInTheDocument();
      expect(screen.queryByText('ABC123')).not.toBeInTheDocument();
      expect(screen.queryByText('GHI789')).not.toBeInTheDocument();
    });
  });


  /**
   * Test 2:
   * Verifica que al hacer clic en "Gestionar reservas"
   * se invoque navigate con la ruta correcta.
   */
  it('navega a la página de gestión al hacer clic en "Gestionar reservas"', async () => {

    render(
      <MemoryRouter>
        <ManageBookingsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ApiService.getAllBookings).toHaveBeenCalled();
    });

    /**
     * Se obtiene el botón correspondiente
     * a la primera reserva.
     */
    const manageButtons =
      screen.getAllByText(/Gestionar reservas/i);

    fireEvent.click(manageButtons[0]);

    /**
     * Verifica que se haya llamado navigate
     * con la ruta dinámica correcta.
     */
    expect(mockNavigate).toHaveBeenCalledWith(
      `/admin/edit-booking/${bookingsMock[0].bookingConfirmationCode}`
    );
  });

});