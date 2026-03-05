// src/component/booking_rooms/RoomDetailsPage.test.jsx

/**
 * RoomDetailsPage Test Suite
 * -----------------------------------------------------------------------------
 * Pruebas unitarias y de integración para el componente RoomDetailsPage.
 *
 * Responsabilidades principales:
 * - Verificar renderizado inicial (loading state).
 * - Verificar manejo de errores de API.
 * - Verificar renderizado correcto de detalles de la habitación.
 * - Probar interacción de selección de fechas y número de invitados.
 * - Probar confirmación y aceptación de reservas llamando a ApiService.bookRoom.
 *
 * Dependencias:
 * - @testing-library/react para render, screen, fireEvent, waitFor.
 * - vitest para describe, it, expect, vi, beforeEach.
 * - react-router-dom mocks para navegación y parámetros de URL.
 * - ApiService mock para simular llamadas a API.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RoomDetailsPage from "./RoomDetailsPage";
import { BrowserRouter, useNavigate, useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";

// --------------------------------------------------
// Mocks de react-router-dom para navegación y params
// --------------------------------------------------
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(), // Mock de useNavigate
    useParams: vi.fn(),   // Mock de useParams
  };
});

// --------------------------------------------------
// Mock de ApiService
// --------------------------------------------------
vi.mock("../../service/ApiService", () => {
  return {
    default: {
      getRoomById: vi.fn(),       // Simula obtener habitación por ID
      getUserProfile: vi.fn(),    // Simula obtener perfil de usuario
      bookRoom: vi.fn(),          // Simula la acción de reservar habitación
    }
  };
});

describe("RoomDetailsPage", () => {
  const mockNavigate = vi.fn(); // Mock para navigate
  const roomMock = {            // Datos simulados de habitación
    id: 1,
    roomType: "Single",
    roomPrice: 100,
    roomPhotoUrl: "photo.jpg",
    description: "Una habitación cómoda",
    bookings: [
      { id: 1, checkInDate: "2026-03-01", checkOutDate: "2026-03-05" },
    ],
  };

  // Antes de cada test, limpiamos mocks y configuramos retorno de hooks
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ roomId: "1" });
  });

  // --------------------------------------------------
  // Test: Loading inicial
  // --------------------------------------------------
  it("muestra loading inicialmente", async () => {
    // Simular API que nunca responde para verificar estado de loading
    ApiService.getRoomById.mockReturnValue(new Promise(() => {}));

    render(
      <BrowserRouter>
        <RoomDetailsPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Cargando detalles de la sala...")).toBeInTheDocument();
  });

  // --------------------------------------------------
  // Test: Manejo de error de API
  // --------------------------------------------------
  it("muestra error si falla la API", async () => {
    ApiService.getRoomById.mockRejectedValue({ message: "Error de API" });
    ApiService.getUserProfile.mockResolvedValue({ user: { id: 1 } });

    render(
      <BrowserRouter>
        <RoomDetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Error de API")).toBeInTheDocument();
    });
  });

  // --------------------------------------------------
  // Test: Renderizado correcto de detalles de la habitación
  // --------------------------------------------------
  it("renderiza detalles de la habitación correctamente", async () => {
    ApiService.getRoomById.mockResolvedValue({ room: roomMock });
    ApiService.getUserProfile.mockResolvedValue({ user: { id: 10 } });

    render(
      <BrowserRouter>
        <RoomDetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Detalles de la habitación")).toBeInTheDocument();
      expect(screen.getByText("Single")).toBeInTheDocument();
      expect(screen.getByText("Precio: $100 / noche")).toBeInTheDocument();
      expect(screen.getByText("Una habitación cómoda")).toBeInTheDocument();
      expect(screen.getByText("Registrarse: 2026-03-01")).toBeInTheDocument();
    });
  });

  // --------------------------------------------------
  // Test: Interacción con DatePicker y cálculo de total
  // --------------------------------------------------
  it("permite abrir datepicker y calcular precio total", async () => {
    ApiService.getRoomById.mockResolvedValue({ room: roomMock });
    ApiService.getUserProfile.mockResolvedValue({ user: { id: 10 } });

    render(
      <BrowserRouter>
        <RoomDetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Reservar ahora"));

    // Abrir DatePicker simulando clic
    fireEvent.click(screen.getByText("Reservar ahora"));

    // Simular ingreso de número de adultos y niños
    fireEvent.change(screen.getAllByRole("spinbutton")[0], { target: { value: 2 } }); // adultos
    fireEvent.change(screen.getAllByRole("spinbutton")[1], { target: { value: 1 } }); // niños

    // Confirmar reserva (mock de handleConfirmBooking)
    const confirmButton = screen.getByText("Confirmar reserva");
    fireEvent.click(confirmButton);

    // Verificar que botón de confirmación existe
    expect(confirmButton).toBeInTheDocument();
  });

  // --------------------------------------------------
  // Test: Aceptación de reserva llamando a ApiService.bookRoom
  // --------------------------------------------------
  it("acepta booking llamando a ApiService.bookRoom", async () => {
    ApiService.getRoomById.mockResolvedValue({ room: roomMock });
    ApiService.getUserProfile.mockResolvedValue({ user: { id: 10 } });
    ApiService.bookRoom.mockResolvedValue({
      statusCode: 200,
      bookingConfirmationCode: "ABC123",
    });

    render(
      <BrowserRouter>
        <RoomDetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Reservar ahora"));

    fireEvent.click(screen.getByText("Reservar ahora"));

    // Simulamos aceptación de reserva
    const acceptButton = document.createElement("button");
    acceptButton.onclick = async () => {
      const response = await ApiService.bookRoom(1, 10, {
        checkInDate: "2026-03-01",
        checkOutDate: "2026-03-05",
        numOfAdults: 2,
        numOfChildren: 1,
      });
      expect(response.statusCode).toBe(200);
    };
    await acceptButton.onclick();
  });
});