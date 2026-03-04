import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RoomSearch from "./RoomSearch";
import ApiService from "../../service/ApiService";

vi.mock("../../service/ApiService", () => ({
  default: {
    getRoomTypes: vi.fn(),
    getAvailableRoomsByDateAndType: vi.fn(),
  },
}));

vi.mock("react-datepicker", () => ({
  default: ({ onChange, placeholderText }) => (
    <input
      placeholder={placeholderText}
      onChange={(e) => {
        const date = new Date(e.target.value);
        onChange(date);
      }}
    />
  ),
}));

describe("RoomSearch", () => {
  const mockHandleSearchResult = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza correctamente los campos", async () => {
    ApiService.getRoomTypes.mockResolvedValue(["Single", "Double"]);

    render(<RoomSearch handleSearchResult={mockHandleSearchResult} />);

    expect(await screen.findByText("Single")).toBeInTheDocument();
    expect(await screen.findByText("Double")).toBeInTheDocument();
  });

  it("muestra error si faltan campos", async () => {
    ApiService.getRoomTypes.mockResolvedValue(["Single"]);

    render(<RoomSearch handleSearchResult={mockHandleSearchResult} />);

    await userEvent.click(screen.getByText("Buscar habitaciones"));

    expect(
      await screen.findByText("Por favor seleccione todos los campos")
    ).toBeInTheDocument();
  });

  it("llama a la API y devuelve resultados correctamente", async () => {
    ApiService.getRoomTypes.mockResolvedValue(["Single"]);
    ApiService.getAvailableRoomsByDateAndType.mockResolvedValue({
      statusCode: 200,
      roomList: [{ id: 1 }],
    });

    render(<RoomSearch handleSearchResult={mockHandleSearchResult} />);

    await userEvent.type(
      screen.getByPlaceholderText("Seleccione la fecha de entrada"),
      "2026-03-10"
    );

    await userEvent.type(
      screen.getByPlaceholderText("Seleccione la fecha de salida"),
      "2026-03-15"
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox"),
      "Single"
    );

    await userEvent.click(screen.getByText("Buscar habitaciones"));

    await waitFor(() => {
      expect(
        ApiService.getAvailableRoomsByDateAndType
      ).toHaveBeenCalledTimes(1);
    });

    expect(mockHandleSearchResult).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it("muestra error si no hay habitaciones disponibles", async () => {
    ApiService.getRoomTypes.mockResolvedValue(["Single"]);
    ApiService.getAvailableRoomsByDateAndType.mockResolvedValue({
      statusCode: 200,
      roomList: [],
    });

    render(<RoomSearch handleSearchResult={mockHandleSearchResult} />);

    await userEvent.type(
      screen.getByPlaceholderText("Seleccione la fecha de entrada"),
      "2026-03-10"
    );

    await userEvent.type(
      screen.getByPlaceholderText("Seleccione la fecha de salida"),
      "2026-03-15"
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox"),
      "Single"
    );

    await userEvent.click(screen.getByText("Buscar habitaciones"));

    expect(
      await screen.findByText(
        "Habitación no disponible actualmente para este rango de fechas en el tipo de habitación seleccionado."
      )
    ).toBeInTheDocument();
  });
});