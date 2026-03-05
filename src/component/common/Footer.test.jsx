/**
 * FooterComponent.test.jsx
 * -----------------------------------------------------------------------------
 * Tests unitarios para el componente FooterComponent.
 *
 * Responsabilidades principales:
 * - Verificar que el footer se renderiza correctamente.
 * - Comprobar que muestra el año actual dinámicamente.
 * - Asegurar que el footer utiliza correctamente el elemento semántico <footer>.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FooterComponent from "./Footer";

describe("FooterComponent", () => {

  /**
   * Test: renderiza el footer correctamente
   * -----------------------------------------------------------------------------
   * Verifica que el texto principal "Roomly Stay" esté presente en el DOM.
   */
  it("renderiza el footer correctamente", () => {
    render(<FooterComponent />);
    expect(screen.getByText(/Roomly Stay/)).toBeInTheDocument();
  });

  /**
   * Test: muestra el año actual
   * -----------------------------------------------------------------------------
   * Comprueba que el footer renderiza dinámicamente el año correcto.
   * Esto asegura que la función `new Date().getFullYear()` funciona como se espera.
   */
  it("muestra el año actual", () => {
    render(<FooterComponent />);
    const currentYear = new Date().getFullYear();

    expect(
      screen.getByText(
        `Roomly Stay | Todos los derechos reservados © ${currentYear}`
      )
    ).toBeInTheDocument();
  });

  /**
   * Test: renderiza el elemento footer
   * -----------------------------------------------------------------------------
   * Verifica que el componente utiliza el elemento semántico <footer> correctamente.
   * Se utiliza el role "contentinfo" que es el rol accesible para footers.
   */
  it("renderiza el elemento footer", () => {
    render(<FooterComponent />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

});