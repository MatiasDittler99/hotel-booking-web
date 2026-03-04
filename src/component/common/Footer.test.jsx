import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FooterComponent from "./Footer";

describe("FooterComponent", () => {
  it("renderiza el footer correctamente", () => {
    render(<FooterComponent />);
    expect(screen.getByText(/Roomly Stay/)).toBeInTheDocument();
  });

  it("muestra el año actual", () => {
    render(<FooterComponent />);
    const currentYear = new Date().getFullYear();

    expect(
      screen.getByText(
        `Roomly Stay | Todos los derechos reservados © ${currentYear}`
      )
    ).toBeInTheDocument();
  });

  it("renderiza el elemento footer", () => {
    render(<FooterComponent />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});