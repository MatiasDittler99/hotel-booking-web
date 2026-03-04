import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RoomResult from "./RoomResult";
import ApiService from "../../service/ApiService";

// 🔹 Mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// 🔹 Mock ApiService
vi.mock("../../service/ApiService", () => ({
  default: {
    isAdmin: vi.fn(),
  },
}));

describe("RoomResult", () => {
  const mockRooms = [
    {
      id: 1,
      roomType: "Single",
      roomPrice: 100,
      roomDescription: "Habitación simple",
      roomPhotoUrl: "photo.jpg",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza correctamente los datos de la habitación", () => {
    ApiService.isAdmin.mockReturnValue(false);

    render(<RoomResult roomSearchResults={mockRooms} />);

    expect(screen.getByText("Single")).toBeInTheDocument();
    expect(screen.getByText("Precio: $100 / noche")).toBeInTheDocument();
    expect(screen.getByText("Descripción: Habitación simple")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "photo.jpg");
  });

  it("muestra botón de reservar si no es admin", () => {
    ApiService.isAdmin.mockReturnValue(false);

    render(<RoomResult roomSearchResults={mockRooms} />);

    expect(
      screen.getByText("Ver/Reservar ahora")
    ).toBeInTheDocument();
  });

  it("muestra botón de edición si es admin", () => {
    ApiService.isAdmin.mockReturnValue(true);

    render(<RoomResult roomSearchResults={mockRooms} />);

    expect(
      screen.getByText("Sala de edición")
    ).toBeInTheDocument();
  });

  it("navega correctamente al reservar", async () => {
    ApiService.isAdmin.mockReturnValue(false);

    render(<RoomResult roomSearchResults={mockRooms} />);

    await userEvent.click(screen.getByText("Ver/Reservar ahora"));

    expect(mockNavigate).toHaveBeenCalledWith("/room-details-book/1");
  });

  it("navega correctamente al editar si es admin", async () => {
    ApiService.isAdmin.mockReturnValue(true);

    render(<RoomResult roomSearchResults={mockRooms} />);

    await userEvent.click(screen.getByText("Sala de edición"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin/edit-room/1");
  });
});