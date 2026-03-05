/**
 * BookingResult.test.jsx
 * -----------------------------------------------------------------------------
 * Tests unitarios para el componente BookingResult.
 *
 * Responsabilidades principales:
 * - Verificar que el componente renderiza correctamente la lista de reservas.
 * - Asegurar que la información de cada reserva se muestra correctamente.
 * - Comprobar que los enlaces de edición de cada reserva apuntan a la URL correcta.
 *
 * Dependencias:
 * - React Testing Library para renderizado y queries.
 * - Vitest para describir y ejecutar tests unitarios.
 * - BrowserRouter de React Router para soporte de links.
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BookingResult from "./BookingResult";
import { BrowserRouter } from "react-router-dom";

describe("BookingResult", () => {
  // Datos de ejemplo para las reservas
  const sampleBookings = [
    {
      id: 1,
      roomId: 101,
      userId: 5,
      startDate: "2026-03-01",
      endDate: "2026-03-05",
      status: "Confirmada",
    },
    {
      id: 2,
      roomId: 102,
      userId: 6,
      startDate: "2026-03-02",
      endDate: "2026-03-06",
      status: "Pendiente",
    },
  ];

  /**
   * Test 1: Renderiza todas las reservas pasadas por props
   * Verifica que el número de elementos coincida con la cantidad de bookings
   */
  it("renderiza todos los bookings pasados por props", () => {
    render(
      <BrowserRouter>
        <BookingResult bookingSearchResults={sampleBookings} />
      </BrowserRouter>
    );

    // Verifica que se rendericen los campos "ID de la habitación" y "ID de usuario"
    expect(screen.getAllByText(/ID de la habitación:/)).toHaveLength(2);
    expect(screen.getAllByText(/ID de usuario:/)).toHaveLength(2);
  });

  /**
   * Test 2: Muestra la información correcta de cada booking
   * Comprueba que todos los campos de las reservas se renderizan correctamente
   */
  it("muestra la información correcta de cada booking", () => {
    render(
      <BrowserRouter>
        <BookingResult bookingSearchResults={sampleBookings} />
      </BrowserRouter>
    );

    // Verifica los datos del primer booking
    expect(screen.getByText("ID de la habitación: 101")).toBeInTheDocument();
    expect(screen.getByText("ID de usuario: 5")).toBeInTheDocument();
    expect(screen.getByText("Fecha de inicio: 2026-03-01")).toBeInTheDocument();
    expect(screen.getByText("Fecha de finalización: 2026-03-05")).toBeInTheDocument();
    expect(screen.getByText("Estado: Confirmada")).toBeInTheDocument();

    // Verifica los datos del segundo booking
    expect(screen.getByText("ID de la habitación: 102")).toBeInTheDocument();
    expect(screen.getByText("ID de usuario: 6")).toBeInTheDocument();
    expect(screen.getByText("Fecha de inicio: 2026-03-02")).toBeInTheDocument();
    expect(screen.getByText("Fecha de finalización: 2026-03-06")).toBeInTheDocument();
    expect(screen.getByText("Estado: Pendiente")).toBeInTheDocument();
  });

  /**
   * Test 3: Renderiza los links correctos para editar cada booking
   * Comprueba que cada enlace apunta a la URL correcta de edición
   */
  it("renderiza los links correctos para editar cada booking", () => {
    render(
      <BrowserRouter>
        <BookingResult bookingSearchResults={sampleBookings} />
      </BrowserRouter>
    );

    const editLinks = screen.getAllByText("Editar");

    // Deben existir tantos links como bookings
    expect(editLinks).toHaveLength(2);

    // Verifica la URL de cada link de edición
    expect(editLinks[0].closest("a")).toHaveAttribute("href", "/admin/edit-booking/1");
    expect(editLinks[1].closest("a")).toHaveAttribute("href", "/admin/edit-booking/2");
  });
});