// src/component/admin/ManageBookingsPage.test.jsx
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageBookingsPage from './ManageBookingsPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock ApiService
vi.mock('../../service/ApiService', () => ({
  default: {
    getAllBookings: vi.fn(),
  },
}));

describe('ManageBookingsPage unit test', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    ApiService.getAllBookings.mockResolvedValue({ bookingList: bookingsMock });
  });

  it('muestra todas las reservas y permite filtrar por código', async () => {
    const { container } = render(
      <MemoryRouter>
        <ManageBookingsPage />
      </MemoryRouter>
    );

    // Esperamos a que se carguen las reservas
    await waitFor(() => {
      expect(ApiService.getAllBookings).toHaveBeenCalled();
    });

    // Todas las reservas deberían estar presentes
    bookingsMock.forEach((b) => {
      expect(screen.getByText(b.bookingConfirmationCode)).toBeInTheDocument();
    });

    // Filtramos por 'DEF'
    const input = screen.getByPlaceholderText(/Introduzca el número de reserva/i);
    fireEvent.change(input, { target: { value: 'DEF' } });

    await waitFor(() => {
      // Solo la reserva DEF456 debería aparecer
      const bookingItems = container.querySelectorAll('.booking-result-item');
      expect(bookingItems.length).toBe(1);
      expect(screen.getByText('DEF456')).toBeInTheDocument();
      expect(screen.queryByText('ABC123')).not.toBeInTheDocument();
      expect(screen.queryByText('GHI789')).not.toBeInTheDocument();
    });
  });

  it('navega a la página de gestión al hacer clic en "Gestionar reservas"', async () => {
    render(
      <MemoryRouter>
        <ManageBookingsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ApiService.getAllBookings).toHaveBeenCalled();
    });

    // Hacemos clic en el botón de la primera reserva
    const manageButtons = screen.getAllByText(/Gestionar reservas/i);
    fireEvent.click(manageButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(`/admin/edit-booking/${bookingsMock[0].bookingConfirmationCode}`);
  });
});