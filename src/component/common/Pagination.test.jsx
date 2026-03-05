import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Pagination from "./Pagination";

describe("Pagination", () => {
  /**
   * Test: renderiza la cantidad correcta de páginas
   * ------------------------------------------------
   * Verifica que el componente muestre todos los números de página
   * calculados según totalRooms / roomsPerPage.
   */
  it("renderiza la cantidad correcta de páginas", () => {
    render(
      <Pagination
        roomsPerPage={5}   // 5 habitaciones por página
        totalRooms={20}    // 20 habitaciones en total
        currentPage={1}    // página actual
        paginate={vi.fn()} // función mock para navegar
      />
    );

    // 20 / 5 = 4 páginas, comprobamos que cada número está presente
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  /**
   * Test: llama a paginate cuando se hace click
   * -------------------------------------------
   * Simula el clic en un número de página y verifica que la función
   * paginate se llame con el número correcto.
   */
  it("llama a paginate cuando se hace click", async () => {
    const mockPaginate = vi.fn(); // mock de función para verificar llamadas

    render(
      <Pagination
        roomsPerPage={5}
        totalRooms={15}
        currentPage={1}
        paginate={mockPaginate}
      />
    );

    // Simula clic en la página 2
    await userEvent.click(screen.getByText("2"));

    // Verifica que paginate fue llamado con el número 2
    expect(mockPaginate).toHaveBeenCalledWith(2);
  });

  /**
   * Test: marca la página actual correctamente
   * ------------------------------------------
   * Asegura que la página actualmente seleccionada tenga la clase CSS 'current-page'.
   */
  it("marca la página actual correctamente", () => {
    render(
      <Pagination
        roomsPerPage={5}
        totalRooms={15}
        currentPage={2} // página actual = 2
        paginate={vi.fn()}
      />
    );

    const currentButton = screen.getByText("2");

    expect(currentButton).toHaveClass("current-page");
  });

  /**
   * Test: no renderiza páginas si totalRooms es 0
   * ---------------------------------------------
   * Caso límite: si no hay habitaciones, no deben aparecer botones.
   */
  it("no renderiza páginas si totalRooms es 0", () => {
    render(
      <Pagination
        roomsPerPage={5}
        totalRooms={0}  // no hay habitaciones
        currentPage={1}
        paginate={vi.fn()}
      />
    );

    // No debería existir ningún botón
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});