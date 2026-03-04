// src/component/admin/ManageRoomPage.test.jsx
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageRoomPage from './ManageRoomPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../service/ApiService', () => ({
  default: {
    getAllRooms: vi.fn(),
    getRoomTypes: vi.fn(),
    isAdmin: vi.fn(() => true),
  },
}));

describe('ManageRoomPage unit test', () => {
  const roomsMock = [
    { id: 1, roomType: 'Single', number: '101', price: 100, description: 'Habitación sencilla' },
    { id: 2, roomType: 'Double', number: '102', price: 200, description: 'Habitación doble' },
    { id: 3, roomType: 'Suite', number: '103', price: 300, description: 'Suite deluxe' },
  ];

  const roomTypesMock = ['Single', 'Double', 'Suite'];

  beforeEach(() => {
    vi.clearAllMocks();
    ApiService.getAllRooms.mockResolvedValue({ roomList: roomsMock });
    ApiService.getRoomTypes.mockResolvedValue(roomTypesMock);
  });

  it('muestra las habitaciones y permite filtrar por tipo', async () => {
    const { container } = render(
        <MemoryRouter>
        <ManageRoomPage />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(ApiService.getAllRooms).toHaveBeenCalled();
        expect(ApiService.getRoomTypes).toHaveBeenCalled();
    });

    // Obtenemos el select de tipos de habitación
    const select = screen.getByLabelText(/Filtrar por tipo de habitación:/i);

    // Filtramos por "Double"
    fireEvent.change(select, { target: { value: 'Double' } });

    // Verificamos solo dentro de la lista de habitaciones
    const roomList = container.querySelector('.room-list');

    await waitFor(() => {
        // Debemos buscar los títulos h3 dentro de .room-list
        const roomTitles = Array.from(roomList.querySelectorAll('h3')).map(el => el.textContent);
        expect(roomTitles).toContain('Double');
        expect(roomTitles).not.toContain('Single');
        expect(roomTitles).not.toContain('Suite');
    });
    });

  it('navega a /admin/add-room al hacer clic en "Añadir habitación"', async () => {
    render(
      <MemoryRouter>
        <ManageRoomPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ApiService.getAllRooms).toHaveBeenCalled();
      expect(ApiService.getRoomTypes).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByText(/Añadir habitación/i));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/add-room');
  });
});