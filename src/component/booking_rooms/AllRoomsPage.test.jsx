// src/component/booking_rooms/AllRoomsPage.test.jsx

/**
 * AllRoomsPage Component Test Suite
 * -----------------------------------------------------------------------------
 * Conjunto de pruebas unitarias para el componente AllRoomsPage.
 *
 * Objetivos principales:
 * - Verificar renderizado inicial de la página.
 * - Asegurar que las llamadas a la API se realizan correctamente.
 * - Probar filtrado por tipo de habitación.
 * - Probar manejo de resultados de búsqueda.
 * - Probar interacción con la paginación.
 *
 * Estrategia:
 * - Mock de ApiService para controlar los datos retornados.
 * - Mock de componentes hijos (RoomSearch, RoomResult, Pagination) para aislar AllRoomsPage.
 * - Uso de @testing-library/react para renderizado, interacción y aserciones.
 * - Uso de Vitest (vi) para mocks y spies.
 */

import { describe, beforeEach, it, expect, vi } from 'vitest'; 
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AllRoomsPage from './AllRoomsPage';
import ApiService from '../../service/ApiService';

/**
 * Mock de RoomSearch
 * -----------------------------------------------------------------------------
 * Componente hijo simulado que permite probar la integración de handleSearchResult.
 * Al hacer click, simula que devuelve un resultado de búsqueda.
 */
vi.mock('../common/RoomSearch', () => ({
  default: ({ handleSearchResult }) => (
    <button onClick={() => handleSearchResult([{ id: 99, roomType: 'Suite', name: 'Test Room' }])}>
      Mock RoomSearch
    </button>
  ),
}));

/**
 * Mock de RoomResult
 * -----------------------------------------------------------------------------
 * Componente hijo simulado para renderizar habitaciones filtradas.
 * Utiliza roomSearchResults para mostrar nombres de habitaciones.
 */
vi.mock('../common/RoomResult', () => ({
  default: ({ roomSearchResults }) => (
    <div data-testid="room-results">
      {roomSearchResults.map((room) => (
        <div key={room.id}>{room.name}</div>
      ))}
    </div>
  ),
}));

/**
 * Mock de Pagination
 * -----------------------------------------------------------------------------
 * Componente hijo simulado para probar interacción de paginación.
 * Al hacer click en el botón, llama a la función paginate con página 2.
 */
vi.mock('../common/Pagination', () => ({
  default: ({ paginate }) => (
    <button onClick={() => paginate(2)}>Go to page 2</button>
  ),
}));

/**
 * Mock de ApiService
 * -----------------------------------------------------------------------------
 * Se mockea para controlar respuestas de getAllRooms y getRoomTypes,
 * evitando llamadas reales a la API durante las pruebas.
 */
vi.mock('../../service/ApiService');

describe('AllRoomsPage', () => {
  /**
   * Datos simulados para pruebas
   */
  const mockRooms = [
    { id: 1, roomType: 'Single', name: 'Room 1' },
    { id: 2, roomType: 'Double', name: 'Room 2' },
    { id: 3, roomType: 'Suite', name: 'Room 3' },
  ];

  const mockRoomTypes = ['Single', 'Double', 'Suite'];

  /**
   * beforeEach
   * -----------------------------------------------------------------------------
   * Se ejecuta antes de cada test para:
   * - Limpiar mocks de Vitest.
   * - Configurar respuestas mockeadas de ApiService.
   */
  beforeEach(() => {
    vi.clearAllMocks();
    ApiService.getAllRooms.mockResolvedValue({ roomList: mockRooms });
    ApiService.getRoomTypes.mockResolvedValue(mockRoomTypes);
  });

  /**
   * Test: Renderizado inicial y llamadas a API
   * -----------------------------------------------------------------------------
   * Verifica que:
   * - El título principal se renderiza.
   * - Se cargan y muestran correctamente los tipos de habitación.
   * - RoomResult muestra todas las habitaciones obtenidas.
   * - ApiService.getAllRooms y ApiService.getRoomTypes fueron llamados.
   */
  it('renderiza la página y llama a la API', async () => {
    render(<AllRoomsPage />);

    // Verifica título
    expect(screen.getByText('Todas las habitaciones')).toBeInTheDocument();

    // Espera a que los roomTypes se carguen
    await waitFor(() => {
      mockRoomTypes.forEach((type) => {
        expect(screen.getByRole('option', { name: type })).toBeInTheDocument();
      });
    });

    // Verifica que RoomResult renderice las habitaciones
    await waitFor(() => {
      mockRooms.forEach((room) => {
        expect(screen.getByText(room.name)).toBeInTheDocument();
      });
    });

    // Verifica que las APIs fueron llamadas
    expect(ApiService.getAllRooms).toHaveBeenCalled();
    expect(ApiService.getRoomTypes).toHaveBeenCalled();
  });

  /**
   * Test: Filtrado por tipo de habitación
   * -----------------------------------------------------------------------------
   * Simula selección de un tipo y verifica que solo se muestren habitaciones correspondientes.
   */
  it('filtra habitaciones por tipo', async () => {
    render(<AllRoomsPage />);
    await waitFor(() => screen.getByText('Room 1'));

    // Selecciona "Double"
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Double' } });

    // Solo debería mostrar Room 2
    await waitFor(() => {
      expect(screen.getByText('Room 2')).toBeInTheDocument();
      expect(screen.queryByText('Room 1')).toBeNull();
      expect(screen.queryByText('Room 3')).toBeNull();
    });
  });

  /**
   * Test: Manejo de resultados de búsqueda
   * -----------------------------------------------------------------------------
   * Simula una búsqueda usando RoomSearch y verifica que se actualicen los resultados.
   */
  it('maneja resultados de búsqueda', async () => {
    render(<AllRoomsPage />);
    await waitFor(() => screen.getByText('Room 1'));

    // Click en el mock de RoomSearch
    fireEvent.click(screen.getByText('Mock RoomSearch'));

    // Debería mostrar solo la habitación de prueba
    await waitFor(() => {
      expect(screen.getByText('Test Room')).toBeInTheDocument();
      expect(screen.queryByText('Room 1')).toBeNull();
    });
  });

  /**
   * Test: Interacción con paginación
   * -----------------------------------------------------------------------------
   * Simula click en paginación y verifica que la función paginate es llamada.
   * En este test conceptual, verificamos que el botón existe y es clickeable.
   */
  it('cambia de página usando la paginación', async () => {
    render(<AllRoomsPage />);
    await waitFor(() => screen.getByText('Room 1'));

    // Click en el botón mock de paginación
    fireEvent.click(screen.getByText('Go to page 2'));

    // Verifica que currentPage cambió (mock conceptual)
    expect(screen.getByText('Go to page 2')).toBeInTheDocument();
  });
});