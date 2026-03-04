// src/component/booking_rooms/FindBookingPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FindBookingPage from './FindBookingPage';

// Mock del ApiService como default export
vi.mock('../../service/ApiService', () => {
  return {
    default: {
      getBookingByConfirmationCode: vi.fn(),
    },
  };
});

import ApiService from '../../service/ApiService';

describe('FindBookingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  it('renderiza la página correctamente', () => {
    render(<FindBookingPage />);
    expect(screen.getByText('Encuentra reservas')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Introduzca su código de confirmación de reserva')).toBeInTheDocument();
    expect(screen.getByText('Encontrar')).toBeInTheDocument();
  });

  it('muestra error si no se ingresa código de confirmación', async () => {
    render(<FindBookingPage />);
    fireEvent.click(screen.getByText('Encontrar'));
    await waitFor(() =>
      expect(screen.getByText('Por favor, introduzca un código de confirmación de reserva')).toBeInTheDocument()
    );
  });

  it('muestra detalles de la reserva si la búsqueda es exitosa', async () => {
    const mockBooking = {
      bookingConfirmationCode: 'ABC123',
      checkInDate: '2026-03-10',
      checkOutDate: '2026-03-15',
      numOfAdults: 2,
      numOfChildren: 1,
      user: {
        name: 'Juan Perez',
        email: 'juan@example.com',
        phoneNumber: '123456789',
      },
      room: {
        roomType: 'Single',
        roomPhotoUrl: 'room.jpg',
      },
    };
    ApiService.getBookingByConfirmationCode.mockResolvedValueOnce({ booking: mockBooking });

    render(<FindBookingPage />);
    fireEvent.change(screen.getByPlaceholderText('Introduzca su código de confirmación de reserva'), {
      target: { value: 'ABC123' },
    });
    fireEvent.click(screen.getByText('Encontrar'));

    await waitFor(() => {
      expect(screen.getByText(`Código de confirmación: ${mockBooking.bookingConfirmationCode}`)).toBeInTheDocument();
      expect(screen.getByText(`Fecha de entrada: ${mockBooking.checkInDate}`)).toBeInTheDocument();
      expect(screen.getByText(`Nombre: ${mockBooking.user.name}`)).toBeInTheDocument();
      expect(screen.getByText(`Tipo de habitación: ${mockBooking.room.roomType}`)).toBeInTheDocument();
    });
  });

  it('muestra error si la API falla', async () => {
    ApiService.getBookingByConfirmationCode.mockRejectedValueOnce(new Error('API Error'));

    render(<FindBookingPage />);
    fireEvent.change(screen.getByPlaceholderText('Introduzca su código de confirmación de reserva'), {
      target: { value: 'ABC123' },
    });
    fireEvent.click(screen.getByText('Encontrar'));

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
});