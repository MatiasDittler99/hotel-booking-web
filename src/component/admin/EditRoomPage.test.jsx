/**
 * ==========================================================
 * EditRoomPage.test.jsx
 * ----------------------------------------------------------
 * Tests unitarios del componente EditRoomPage.
 *
 * Objetivos del test:
 * - Verificar carga inicial de datos desde la API
 * - Validar flujo de actualización
 * - Validar flujo de eliminación
 * - Verificar comportamiento de preview de imagen
 *
 * Estrategia:
 * - Mock completo de dependencias externas
 *   (react-router-dom + ApiService)
 * - Aislamiento del componente
 * - Uso de Testing Library para pruebas orientadas
 *   al comportamiento del usuario (no implementación)
 * ==========================================================
 */

import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditRoomPage from './EditRoomPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';


/**
 * Mock de navegación.
 * Permite verificar redirecciones sin usar el router real.
 */
const mockNavigate = vi.fn();


/**
 * Mock parcial de react-router-dom.
 * - Se mantiene el comportamiento real excepto:
 *   - useNavigate (mockeado)
 *   - useParams (retorna roomId fijo)
 *
 * Esto garantiza aislamiento del entorno de routing.
 */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ roomId: '1' }),
  };
});


/**
 * Mock del ApiService.
 * Se reemplazan los métodos por funciones simuladas (vi.fn)
 * para evitar llamadas reales a backend.
 */
vi.mock('../../service/ApiService', () => ({
  default: {
    getRoomById: vi.fn(),
    updateRoom: vi.fn(),
    deleteRoom: vi.fn(),
  },
}));


describe('EditRoomPage simple tests', () => {

  /**
   * Mock de respuesta simulada del backend.
   * Representa la estructura esperada por el componente.
   */
  const roomMock = {
    room: {
      roomPhotoUrl: 'https://example.com/photo.jpg',
      roomType: 'Single',
      roomPrice: '100',
      roomDescription: 'Habitación sencilla',
    },
  };

  /**
   * beforeEach:
   * - Limpia todos los mocks
   * - Define comportamiento por defecto de cada método
   * - Mockea window.confirm para flujo de eliminación
   */
  beforeEach(() => {
    vi.clearAllMocks();

    ApiService.getRoomById.mockResolvedValue(roomMock);
    ApiService.updateRoom.mockResolvedValue({ statusCode: 200 });
    ApiService.deleteRoom.mockResolvedValue({ statusCode: 200 });

    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });


  /**
   * Test 1:
   * Verifica que al montar el componente:
   * - Se llame a la API con el roomId correcto
   * - Se rendericen correctamente los datos obtenidos
   */
  it('carga los detalles de la habitación', async () => {
    render(
      <MemoryRouter>
        <EditRoomPage />
      </MemoryRouter>
    );

    // Espera a que la llamada async ocurra
    await waitFor(() =>
      expect(ApiService.getRoomById).toHaveBeenCalledWith('1')
    );

    // Verificación de renderizado basado en datos mockeados
    expect(screen.getByDisplayValue('Single')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Habitación sencilla')).toBeInTheDocument();
    expect(screen.getByAltText('Habitación')).toBeInTheDocument();
  });


  /**
   * Test 2:
   * Verifica flujo de actualización:
   * - Modificación de inputs
   * - Click en botón
   * - Llamada a updateRoom
   */
  it('actualiza la habitación', async () => {
    render(
      <MemoryRouter>
        <EditRoomPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(ApiService.getRoomById).toHaveBeenCalled()
    );

    // Simulación de cambios del usuario
    fireEvent.change(
      screen.getByLabelText(/Tipo de habitación/i),
      { target: { value: 'Double' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Precio de la habitación/i),
      { target: { value: '200' } }
    );

    fireEvent.click(
      screen.getByText(/Actualizar habitación/i)
    );

    await waitFor(() =>
      expect(ApiService.updateRoom).toHaveBeenCalled()
    );
  });


  /**
   * Test 3:
   * Verifica flujo de eliminación:
   * - Click en botón eliminar
   * - Confirmación automática (mock)
   * - Llamada al servicio con ID correcto
   */
  it('elimina la habitación', async () => {
    render(
      <MemoryRouter>
        <EditRoomPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(ApiService.getRoomById).toHaveBeenCalled()
    );

    fireEvent.click(
      screen.getByText(/Eliminar habitación/i)
    );

    await waitFor(() =>
      expect(ApiService.deleteRoom).toHaveBeenCalledWith('1')
    );
  });


  /**
   * Test 4:
   * Verifica comportamiento del preview de imagen:
   * - Simula carga de archivo
   * - Verifica que se renderice imagen preview
   * - Confirma que la URL generada sea tipo blob:
   *
   * Se utiliza act() para evitar warnings relacionados
   * con actualizaciones de estado asincrónicas.
   */
  it('muestra vista previa al subir un archivo', async () => {
    render(
      <MemoryRouter>
        <EditRoomPage />
      </MemoryRouter>
    );

    const file = new File(['dummy'], 'photo.png', { type: 'image/png' });

    const input = screen.getByTestId('room-photo-input');

    // Envuelve en act para asegurar sincronización de estado
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    const previewImg = await screen.findByAltText(
      /Vista previa de la habitación/i
    );

    expect(previewImg).toBeInTheDocument();
    expect(previewImg.src).toContain('blob:');
  });

});