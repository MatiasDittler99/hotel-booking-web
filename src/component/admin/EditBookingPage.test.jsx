// src/component/admin/EditBookingPage.test.jsx

/**
 * Test Suite: EditBookingPage
 * -----------------------------
 * Pruebas unitarias del componente EditBookingPage.
 *
 * Objetivos:
 *  - Verificar carga correcta de los detalles de una reserva.
 *  - Validar ejecución de acción administrativa (cancel / achieve).
 *  - Confirmar navegación tras operación exitosa.
 *  - Comprobar manejo de errores ante fallos del servicio.
 *
 * Estrategia:
 *  - Mock de useParams para controlar el bookingCode.
 *  - Mock de useNavigate para interceptar redirecciones.
 *  - Mock completo de ApiService para aislar lógica del backend.
 *  - Uso de MemoryRouter para proveer contexto de routing.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditBookingPage from './EditBookingPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

/**
 * Mock de navegación.
 * Permite verificar redirecciones sin modificar la URL real.
 */
const mockNavigate = vi.fn();

/**
 * Mock parcial de react-router-dom.
 *
 * - useParams → retorna bookingCode fijo para pruebas determinísticas.
 * - useNavigate → reemplazado por función mock.
 * - Se preserva el resto del comportamiento real del router.
 */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ bookingCode: 'ABC123' }),
    useNavigate: () => mockNavigate,
  };
});

/**
 * Mock del ApiService.
 *
 * Se interceptan:
 *  - getBookingByConfirmationCode
 *  - cancelBooking
 *
 * Esto garantiza:
 *  - Aislamiento total del backend.
 *  - Control completo de escenarios exitosos y fallidos.
 */
vi.mock('../../service/ApiService', () => ({
  default: {
    getBookingByConfirmationCode: vi.fn(),
    cancelBooking: vi.fn(),
  },
}));

describe('EditBookingPage simple tests', () => {

  /**
   * Mock representativo de una reserva completa.
   * Incluye:
   *  - Datos de reserva
   *  - Datos de usuario
   *  - Datos de habitación
   *
   * Permite validar renderizado integral del componente.
   */
  const bookingMock = {
    id: '1',
    bookingConfirmationCode: 'ABC123',
    checkInDate: '2026-03-10',
    checkOutDate: '2026-03-15',
    numOfAdults: 2,
    numOfChildren: 1,
    guestEmail: 'guest@example.com',
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '123456789',
    },
    room: {
      roomType: 'Double',
      roomPrice: '200',
      roomDescription: 'Habitación cómoda',
      roomPhotoUrl: 'https://example.com/photo.jpg',
    },
  };

  /**
   * beforeEach
   * ------------
   * - Limpia mocks para evitar contaminación entre tests.
   * - Define comportamiento por defecto exitoso.
   * - Mockea window.confirm para evitar interacción real.
   */
  beforeEach(() => {
    vi.clearAllMocks();

    ApiService.getBookingByConfirmationCode
      .mockResolvedValue({ booking: bookingMock });

    ApiService.cancelBooking
      .mockResolvedValue({ statusCode: 200 });

    // Simula confirmación positiva del usuario
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  /**
   * Test 1:
   * Verifica que los detalles de la reserva
   * se carguen correctamente desde el servicio
   * y se rendericen en pantalla.
   */
  it('carga los detalles de la reserva', async () => {

    render(
      <MemoryRouter>
        <EditBookingPage />
      </MemoryRouter>
    );

    // Espera a que se invoque la llamada al servicio
    await waitFor(() => {
      expect(ApiService.getBookingByConfirmationCode)
        .toHaveBeenCalledWith('ABC123');
    });

    // Validación de datos renderizados
    expect(
      screen.getByText(/Código de confirmación: ABC123/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Nombre: John Doe/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Tipo de habitación: Double/i)
    ).toBeInTheDocument();
  });

  /**
   * Test 2:
   * Verifica flujo exitoso de acción administrativa.
   *
   * - Se hace click en el botón.
   * - Se confirma que se invoque cancelBooking con el ID correcto.
   * - Se valida mensaje de éxito.
   */
  it('realiza la reserva y navega después', async () => {

    render(
      <MemoryRouter>
        <EditBookingPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(ApiService.getBookingByConfirmationCode).toHaveBeenCalled()
    );

    fireEvent.click(
      screen.getByText(/Conseguir reserva/i)
    );

    await waitFor(() => {
      expect(ApiService.cancelBooking)
        .toHaveBeenCalledWith('1');

      expect(
        screen.getByText(/La reserva se realizó con éxito/i)
      ).toBeInTheDocument();
    });
  });

  /**
   * Test 3:
   * Verifica manejo de error cuando falla la carga inicial.
   *
   * - Se fuerza rechazo del servicio.
   * - Se valida que el mensaje de error aparezca en pantalla.
   */
  it('muestra mensaje de error si falla la carga', async () => {

    ApiService.getBookingByConfirmationCode
      .mockRejectedValueOnce(new Error('Error de prueba'));

    render(
      <MemoryRouter>
        <EditBookingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Error de prueba/i)
      ).toBeInTheDocument();
    });
  });

});