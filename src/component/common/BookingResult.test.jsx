import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BookingResult from "./BookingResult";
import { BrowserRouter } from "react-router-dom";

describe("BookingResult", () => {
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

  it("renderiza todos los bookings pasados por props", () => {
    render(
      <BrowserRouter>
        <BookingResult bookingSearchResults={sampleBookings} />
      </BrowserRouter>
    );

    expect(screen.getAllByText(/ID de la habitación:/)).toHaveLength(2);
    expect(screen.getAllByText(/ID de usuario:/)).toHaveLength(2);
  });

  it("muestra la información correcta de cada booking", () => {
    render(
      <BrowserRouter>
        <BookingResult bookingSearchResults={sampleBookings} />
      </BrowserRouter>
    );

    expect(screen.getByText("ID de la habitación: 101")).toBeInTheDocument();
    expect(screen.getByText("ID de usuario: 5")).toBeInTheDocument();
    expect(screen.getByText("Fecha de inicio: 2026-03-01")).toBeInTheDocument();
    expect(screen.getByText("Fecha de finalización: 2026-03-05")).toBeInTheDocument();
    expect(screen.getByText("Estado: Confirmada")).toBeInTheDocument();

    expect(screen.getByText("ID de la habitación: 102")).toBeInTheDocument();
    expect(screen.getByText("ID de usuario: 6")).toBeInTheDocument();
    expect(screen.getByText("Fecha de inicio: 2026-03-02")).toBeInTheDocument();
    expect(screen.getByText("Fecha de finalización: 2026-03-06")).toBeInTheDocument();
    expect(screen.getByText("Estado: Pendiente")).toBeInTheDocument();
  });

  it("renderiza los links correctos para editar cada booking", () => {
    render(
      <BrowserRouter>
        <BookingResult bookingSearchResults={sampleBookings} />
      </BrowserRouter>
    );

    const editLinks = screen.getAllByText("Editar");
    expect(editLinks).toHaveLength(2);
    expect(editLinks[0].closest("a")).toHaveAttribute("href", "/admin/edit-booking/1");
    expect(editLinks[1].closest("a")).toHaveAttribute("href", "/admin/edit-booking/2");
  });
});