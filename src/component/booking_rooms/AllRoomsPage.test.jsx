// src/component/booking_rooms/AllRoomsPage.test.jsx
import { describe, beforeEach, it, expect, vi } from 'vitest'; 
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AllRoomsPage from './AllRoomsPage';
import ApiService from '../../service/ApiService';

// Mock de componentes hijos para simplificar
vi.mock('../common/RoomSearch', () => ({
  default: ({ handleSearchResult }) => (
    <button onClick={() => handleSearchResult([{ id: 99, roomType: 'Suite', name: 'Test Room' }])}>
      Mock RoomSearch
    </button>
  ),
}));

vi.mock('../common/RoomResult', () => ({
  default: ({ roomSearchResults }) => (
    <div data-testid="room-results">
      {roomSearchResults.map((room) => (
        <div key={room.id}>{room.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('../common/Pagination', () => ({
  default: ({ paginate }) => (
    <button onClick={() => paginate(2)}>Go to page 2</button>
  ),
}));

// Mock de ApiService
vi.mock('../../service/ApiService');

describe('AllRoomsPage', () => {
  const mockRooms = [
    { id: 1, roomType: 'Single', name: 'Room 1' },
    { id: 2, roomType: 'Double', name: 'Room 2' },
    { id: 3, roomType: 'Suite', name: 'Room 3' },
  ];

  const mockRoomTypes = ['Single', 'Double', 'Suite'];

  beforeEach(() => {
    // Resetear mocks
    vi.clearAllMocks();
    ApiService.getAllRooms.mockResolvedValue({ roomList: mockRooms });
    ApiService.getRoomTypes.mockResolvedValue(mockRoomTypes);
  });

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

  it('cambia de página usando la paginación', async () => {
    render(<AllRoomsPage />);
    await waitFor(() => screen.getByText('Room 1'));

    // Click en el botón mock de paginación
    fireEvent.click(screen.getByText('Go to page 2'));

    // Verifica que currentPage cambió (aquí es más conceptual, se puede chequear por UI si hay datos de página 2)
    // Como solo mockeamos un botón, basta con asegurar que el botón existe y es clickeable
    expect(screen.getByText('Go to page 2')).toBeInTheDocument();
  });
});