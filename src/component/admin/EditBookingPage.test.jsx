// src/component/admin/EditBookingPage.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditBookingPage from './EditBookingPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

// Mock navigate
const mockNavigate = vi.fn();

// Mock useParams y useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ bookingCode: 'ABC123' }),
    useNavigate: () => mockNavigate,
  };
});

// Mock ApiService
vi.mock('../../service/ApiService', () => ({
  default: {
    getBookingByConfirmationCode: vi.fn(),
    cancelBooking: vi.fn(),
  },
}));

describe('EditBookingPage simple tests', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    ApiService.getBookingByConfirmationCode.mockResolvedValue({ booking: bookingMock });
    ApiService.cancelBooking.mockResolvedValue({ statusCode: 200 });
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('carga los detalles de la reserva', async () => {
    render(
      <MemoryRouter>
        <EditBookingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ApiService.getBookingByConfirmationCode).toHaveBeenCalledWith('ABC123');
    });

    expect(screen.getByText(/Código de confirmación: ABC123/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre: John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Tipo de habitación: Double/i)).toBeInTheDocument();
  });

  it('realiza la reserva y navega después', async () => {
    render(
      <MemoryRouter>
        <EditBookingPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(ApiService.getBookingByConfirmationCode).toHaveBeenCalled());

    fireEvent.click(screen.getByText(/Conseguir reserva/i));

    await waitFor(() => {
      expect(ApiService.cancelBooking).toHaveBeenCalledWith('1');
      expect(screen.getByText(/La reserva se realizó con éxito/i)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error si falla la carga', async () => {
    ApiService.getBookingByConfirmationCode.mockRejectedValueOnce(new Error('Error de prueba'));

    render(
      <MemoryRouter>
        <EditBookingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error de prueba/i)).toBeInTheDocument();
    });
  });
});