import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("renderiza la cantidad correcta de páginas", () => {
    render(
      <Pagination
        roomsPerPage={5}
        totalRooms={20}
        currentPage={1}
        paginate={vi.fn()}
      />
    );

    // 20 / 5 = 4 páginas
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("llama a paginate cuando se hace click", async () => {
    const mockPaginate = vi.fn();

    render(
      <Pagination
        roomsPerPage={5}
        totalRooms={15}
        currentPage={1}
        paginate={mockPaginate}
      />
    );

    await userEvent.click(screen.getByText("2"));

    expect(mockPaginate).toHaveBeenCalledWith(2);
  });

  it("marca la página actual correctamente", () => {
    render(
      <Pagination
        roomsPerPage={5}
        totalRooms={15}
        currentPage={2}
        paginate={vi.fn()}
      />
    );

    const currentButton = screen.getByText("2");

    expect(currentButton).toHaveClass("current-page");
  });

  it("no renderiza páginas si totalRooms es 0", () => {
    render(
      <Pagination
        roomsPerPage={5}
        totalRooms={0}
        currentPage={1}
        paginate={vi.fn()}
      />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});