// src/component/booking_rooms/FindBookingPage.test.jsx

/**
 * FindBookingPage Component Test Suite
 * -----------------------------------------------------------------------------
 * Conjunto de pruebas unitarias para el componente FindBookingPage.
 *
 * Objetivos principales:
 * - Verificar renderizado inicial de la página y elementos clave.
 * - Validar comportamiento cuando no se ingresa código de confirmación.
 * - Comprobar visualización de detalles de la reserva al buscar exitosamente.
 * - Manejar errores de API correctamente.
 *
 * Estrategia:
 * - Mock de ApiService para controlar respuestas de la API.
 * - Uso de @testing-library/react para renderizado, interacción y aserciones.
 * - Uso de Vitest (vi) para mocks, spies y lifecycle hooks.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FindBookingPage from './FindBookingPage';

/**
 * Mock de ApiService
 * -----------------------------------------------------------------------------
 * - Simula el default export de ApiService con la función getBookingByConfirmationCode.
 * - Permite controlar respuestas exitosas o fallidas en los tests.
 */
vi.mock('../../service/ApiService', () => {
  return {
    default: {
      getBookingByConfirmationCode: vi.fn(),
    },
  };
});

import ApiService from '../../service/ApiService';

describe('FindBookingPage', () => {

  /**
   * beforeEach
   * -----------------------------------------------------------------------------
   * - Se ejecuta antes de cada test para limpiar los mocks y asegurar independencia.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test: Renderizado inicial de la página
   * -----------------------------------------------------------------------------
   * Verifica que:
   * - El título "Encuentra reservas" se muestre.
   * - El input de código de confirmación esté presente.
   * - El botón "Encontrar" esté visible.
   */
  it('renderiza la página correctamente', () => {
    render(<FindBookingPage />);
    expect(screen.getByText('Encuentra reservas')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Introduzca su código de confirmación de reserva')).toBeInTheDocument();
    expect(screen.getByText('Encontrar')).toBeInTheDocument();
  });

  /**
   * Test: Validación de código de confirmación vacío
   * -----------------------------------------------------------------------------
   * - Simula click en "Encontrar" sin ingresar código.
   * - Verifica que se muestre mensaje de error correspondiente.
   */
  it('muestra error si no se ingresa código de confirmación', async () => {
    render(<FindBookingPage />);
    fireEvent.click(screen.getByText('Encontrar'));
    await waitFor(() =>
      expect(screen.getByText('Por favor, introduzca un código de confirmación de reserva')).toBeInTheDocument()
    );
  });

  /**
   * Test: Búsqueda exitosa de reserva
   * -----------------------------------------------------------------------------
   * - Mock de respuesta exitosa de la API con datos de reserva.
   * - Simula ingreso de código y click en "Encontrar".
   * - Verifica que se rendericen correctamente:
   *   - Código de confirmación
   *   - Fecha de entrada
   *   - Información del usuario
   *   - Tipo de habitación
   */
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

  /**
   * Test: Manejo de error de API
   * -----------------------------------------------------------------------------
   * - Mock de error de la API al buscar código de confirmación.
   * - Verifica que se muestre el mensaje de error correspondiente.
   */
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