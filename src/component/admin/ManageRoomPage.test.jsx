// src/component/admin/ManageRoomPage.test.jsx

/**
 * Test unitarios para el componente ManageRoomPage.
 *
 * Objetivo:
 * - Verificar la correcta carga de habitaciones y tipos desde la API.
 * - Validar el comportamiento del filtro por tipo de habitación.
 * - Confirmar la navegación al agregar una nueva habitación.
 *
 * Se utilizan mocks para:
 * - useNavigate (react-router-dom)
 * - ApiService (llamadas HTTP simuladas)
 */

import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageRoomPage from './ManageRoomPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

/**
 * Mock de la función de navegación.
 * Permite verificar redirecciones sin depender del router real.
 */
const mockNavigate = vi.fn();

/**
 * Mock parcial de react-router-dom.
 * Se mantiene la implementación real excepto useNavigate,
 * que se reemplaza por una función mock.
 */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/**
 * Mock del servicio ApiService.
 * Se simulan los métodos utilizados por el componente.
 */
vi.mock('../../service/ApiService', () => ({
  default: {
    getAllRooms: vi.fn(),
    getRoomTypes: vi.fn(),
    isAdmin: vi.fn(() => true),
  },
}));

describe('ManageRoomPage unit test', () => {

  /**
   * Datos simulados de habitaciones.
   * Representan el formato esperado por el componente.
   */
  const roomsMock = [
    { id: 1, roomType: 'Single', number: '101', price: 100, description: 'Habitación sencilla' },
    { id: 2, roomType: 'Double', number: '102', price: 200, description: 'Habitación doble' },
    { id: 3, roomType: 'Suite', number: '103', price: 300, description: 'Suite deluxe' },
  ];

  /**
   * Datos simulados para los tipos de habitación.
   */
  const roomTypesMock = ['Single', 'Double', 'Suite'];

  /**
   * Antes de cada test:
   * - Se limpian los mocks.
   * - Se configuran las respuestas simuladas de la API.
   */
  beforeEach(() => {
    vi.clearAllMocks();
    ApiService.getAllRooms.mockResolvedValue({ roomList: roomsMock });
    ApiService.getRoomTypes.mockResolvedValue(roomTypesMock);
  });

  /**
   * Caso de prueba:
   * Verifica que:
   * - Las habitaciones se carguen correctamente.
   * - El filtro por tipo funcione correctamente.
   */
  it('muestra las habitaciones y permite filtrar por tipo', async () => {

    const { container } = render(
      <MemoryRouter>
        <ManageRoomPage />
      </MemoryRouter>
    );

    /**
     * Se espera a que las llamadas asincrónicas se ejecuten.
     */
    await waitFor(() => {
      expect(ApiService.getAllRooms).toHaveBeenCalled();
      expect(ApiService.getRoomTypes).toHaveBeenCalled();
    });

    /**
     * Se obtiene el select de filtrado usando su label accesible.
     */
    const select = screen.getByLabelText(/Filtrar por tipo de habitación:/i);

    /**
     * Simulamos selección del tipo "Double".
     */
    fireEvent.change(select, { target: { value: 'Double' } });

    /**
     * Se restringe la búsqueda al contenedor específico
     * que renderiza la lista de habitaciones.
     */
    const roomList = container.querySelector('.room-list');

    await waitFor(() => {
      /**
       * Se obtienen los títulos (h3) renderizados dentro de la lista.
       * Se verifica que:
       * - Solo aparezca el tipo seleccionado.
       * - No se rendericen otros tipos.
       */
      const roomTitles = Array.from(
        roomList.querySelectorAll('h3')
      ).map(el => el.textContent);

      expect(roomTitles).toContain('Double');
      expect(roomTitles).not.toContain('Single');
      expect(roomTitles).not.toContain('Suite');
    });
  });

  /**
   * Caso de prueba:
   * Verifica que al hacer clic en el botón
   * "Añadir habitación" se redirija correctamente.
   */
  it('navega a /admin/add-room al hacer clic en "Añadir habitación"', async () => {

    render(
      <MemoryRouter>
        <ManageRoomPage />
      </MemoryRouter>
    );

    /**
     * Se espera a que los datos iniciales se carguen.
     */
    await waitFor(() => {
      expect(ApiService.getAllRooms).toHaveBeenCalled();
      expect(ApiService.getRoomTypes).toHaveBeenCalled();
    });

    /**
     * Simula el clic en el botón de agregar habitación.
     */
    fireEvent.click(screen.getByText(/Añadir habitación/i));

    /**
     * Se valida que la navegación haya sido llamada
     * con la ruta esperada.
     */
    expect(mockNavigate).toHaveBeenCalledWith('/admin/add-room');
  });
});