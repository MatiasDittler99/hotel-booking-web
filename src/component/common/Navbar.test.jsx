import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navbar from "./Navbar";
import ApiService from "../../service/ApiService";

/**
 * 🔹 Mock de navigate
 * ------------------
 * Se simula useNavigate de react-router-dom para poder
 * verificar la navegación sin depender del router real.
 */
const mockNavigate = vi.fn();

/**
 * 🔹 Mock de react-router-dom
 * --------------------------
 * Se mockean NavLink y useNavigate.
 * - NavLink: simple componente <a> para renderizar children.
 * - useNavigate: retorna nuestro mockNavigate.
 */
vi.mock("react-router-dom", () => ({
  NavLink: ({ children }) => <a>{children}</a>,
  useNavigate: () => mockNavigate,
}));

/**
 * 🔹 Mock de ApiService
 * --------------------
 * Simula la lógica de autenticación y roles del usuario.
 */
vi.mock("../../service/ApiService", () => ({
  default: {
    isAuthenticated: vi.fn(),
    isAdmin: vi.fn(),
    isUser: vi.fn(),
    logout: vi.fn(),
  },
}));

/**
 * 🔹 Test Suite: Navbar
 * --------------------
 * Agrupa todas las pruebas relacionadas con el componente Navbar.
 * Verifica:
 * - renderizado de links públicos
 * - comportamiento según roles
 * - lógica de logout
 */
describe("Navbar", () => {

  /**
   * beforeEach
   * ----------
   * Limpia todos los mocks antes de cada test para evitar
   * interferencias entre pruebas.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test: Links públicos
   * -------------------
   * Verifica que los enlaces públicos siempre se rendericen,
   * independientemente del estado de autenticación.
   */
  it("renderiza los links públicos siempre", () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(false);

    render(<Navbar />);

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Habitaciones")).toBeInTheDocument();
    expect(screen.getByText("Buscar Reserva")).toBeInTheDocument();
  });

  /**
   * Test: Usuario no autenticado
   * ----------------------------
   * Verifica que los botones de login y registro
   * aparezcan cuando el usuario no está logueado.
   */
  it("muestra login y register si no está autenticado", () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(false);

    render(<Navbar />);

    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    expect(screen.getByText("Registrarse")).toBeInTheDocument();
  });

  /**
   * Test: Usuario normal
   * --------------------
   * Verifica que el link de perfil aparezca
   * cuando el usuario tiene rol USER.
   */
  it("muestra perfil si es usuario", () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(true);

    render(<Navbar />);

    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });

  /**
   * Test: Administrador
   * -------------------
   * Verifica que el link de administración aparezca
   * cuando el usuario tiene rol ADMIN.
   */
  it("muestra administración si es admin", () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(true);
    ApiService.isUser.mockReturnValue(false);

    render(<Navbar />);

    expect(screen.getByText("Administración")).toBeInTheDocument();
  });

  /**
   * Test: Botón de cerrar sesión visible
   * ------------------------------------
   * Verifica que el botón de cerrar sesión
   * aparezca cuando el usuario está autenticado.
   */
  it("muestra cerrar sesión si está autenticado", () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(false);

    render(<Navbar />);

    expect(
      screen.getByRole("button", { name: "Cerrar Sesión" })
    ).toBeInTheDocument();
  });

  /**
   * Test: Logout confirmado
   * -----------------------
   * Verifica que:
   * - se ejecute ApiService.logout()
   * - se navegue a /home
   * cuando el usuario confirma el cierre de sesión.
   */
  it("ejecuta logout y navega si confirma", async () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(false);

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<Navbar />);

    await userEvent.click(
      screen.getByRole("button", { name: "Cerrar Sesión" })
    );

    expect(ApiService.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  /**
   * Test: Logout cancelado
   * ----------------------
   * Verifica que no se ejecute logout ni navegación
   * cuando el usuario cancela la confirmación.
   */
  it("no hace logout si cancela confirm", async () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(false);

    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<Navbar />);

    await userEvent.click(
      screen.getByRole("button", { name: "Cerrar Sesión" })
    );

    expect(ApiService.logout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});