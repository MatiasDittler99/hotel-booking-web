import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RoomSearch from "./RoomSearch";
import ApiService from "../../service/ApiService";

// 🔹 Mock del ApiService
vi.mock("../../service/ApiService", () => ({
  default: {
    getRoomTypes: vi.fn(),                 // Simula obtener tipos de habitación
    getAvailableRoomsByDateAndType: vi.fn(), // Simula búsqueda de habitaciones disponibles
  },
}));

// 🔹 Mock del DatePicker de react-datepicker
vi.mock("react-datepicker", () => ({
  default: ({ onChange, placeholderText }) => (
    <input
      placeholder={placeholderText}
      onChange={(e) => {
        const date = new Date(e.target.value);
        onChange(date); // Simula seleccionar fecha
      }}
    />
  ),
}));

describe("RoomSearch", () => {
  const mockHandleSearchResult = vi.fn(); // Callback simulado para recibir resultados de búsqueda

  beforeEach(() => {
    vi.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  // 🔹 Test 1: Renderizado de campos y opciones
  it("renderiza correctamente los campos", async () => {
    ApiService.getRoomTypes.mockResolvedValue(["Single", "Double"]);

    render(<RoomSearch handleSearchResult={mockHandleSearchResult} />);

    // Comprobar que las opciones se muestran en el select
    expect(await screen.findByText("Single")).toBeInTheDocument();
    expect(await screen.findByText("Double")).toBeInTheDocument();
  });

  // 🔹 Test 2: Error si el usuario no completa todos los campos
  it("muestra error si faltan campos", async () => {
    ApiService.getRoomTypes.mockResolvedValue(["Single"]);

    render(<RoomSearch handleSearchResult={mockHandleSearchResult} />);

    await userEvent.click(screen.getByText("Buscar habitaciones"));

    // Verifica que el mensaje de error se muestre
    expect(
      await screen.findByText("Por favor seleccione todos los campos")
    ).toBeInTheDocument();
  });

  // 🔹 Test 3: Llamada a API y retorno de resultados
  it("llama a la API y devuelve resultados correctamente", async () => {
    ApiService.getRoomTypes.mockResolvedValue(["Single"]);
    ApiService.getAvailableRoomsByDateAndType.mockResolvedValue({
      statusCode: 200,
      roomList: [{ id: 1 }],
    });

    render(<RoomSearch handleSearchResult={mockHandleSearchResult} />);

    // Simular selección de fechas y tipo de habitación
    await userEvent.type(
      screen.getByPlaceholderText("Seleccione la fecha de entrada"),
      "2026-03-10"
    );

    await userEvent.type(
      screen.getByPlaceholderText("Seleccione la fecha de salida"),
      "2026-03-15"
    );

    await userEvent.selectOptions(screen.getByRole("combobox"), "Single");

    // Hacer click en el botón de búsqueda
    await userEvent.click(screen.getByText("Buscar habitaciones"));

    // Esperar a que la API sea llamada
    await waitFor(() => {
      expect(ApiService.getAvailableRoomsByDateAndType).toHaveBeenCalledTimes(1);
    });

    // Verificar que los resultados se pasaron al callback
    expect(mockHandleSearchResult).toHaveBeenCalledWith([{ id: 1 }]);
  });

  // 🔹 Test 4: Error si no hay habitaciones disponibles
  it("muestra error si no hay habitaciones disponibles", async () => {
    ApiService.getRoomTypes.mockResolvedValue(["Single"]);
    ApiService.getAvailableRoomsByDateAndType.mockResolvedValue({
      statusCode: 200,
      roomList: [],
    });

    render(<RoomSearch handleSearchResult={mockHandleSearchResult} />);

    // Simular selección de fechas y tipo de habitación
    await userEvent.type(
      screen.getByPlaceholderText("Seleccione la fecha de entrada"),
      "2026-03-10"
    );

    await userEvent.type(
      screen.getByPlaceholderText("Seleccione la fecha de salida"),
      "2026-03-15"
    );

    await userEvent.selectOptions(screen.getByRole("combobox"), "Single");

    // Click en buscar
    await userEvent.click(screen.getByText("Buscar habitaciones"));

    // Verificar que se muestre el mensaje de error específico
    expect(
      await screen.findByText(
        "Habitación no disponible actualmente para este rango de fechas en el tipo de habitación seleccionado."
      )
    ).toBeInTheDocument();
  });
});