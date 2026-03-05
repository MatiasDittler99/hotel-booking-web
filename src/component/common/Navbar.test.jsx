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
 * Simula la lógica de autenticación y roles.
 * - isAuthenticated: true/false según test
 * - isAdmin: true/false según test
 * - isUser: true/false según test
 * - logout: función mock para verificar llamadas
 */
vi.mock("../../service/ApiService", () => ({
  default: {
    isAuthenticated: vi.fn(),
    isAdmin: vi.fn(),
    isUser: vi.fn(),
    logout: vi.fn(),
  },
}));

describe("Navbar", () => {
  // Limpiar mocks antes de cada test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza los links públicos siempre", () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(false);

    render(<Navbar />);

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Habitaciones")).toBeInTheDocument();
    expect(screen.getByText("Buscar Reserva")).toBeInTheDocument();
  });

  it("muestra login y register si no está autenticado", () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(false);

    render(<Navbar />);

    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    expect(screen.getByText("Registrarse")).toBeInTheDocument();
  });

  it("muestra perfil si es usuario", () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(true);

    render(<Navbar />);

    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });

  it("muestra administración si es admin", () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(true);
    ApiService.isUser.mockReturnValue(false);

    render(<Navbar />);

    expect(screen.getByText("Administración")).toBeInTheDocument();
  });

  it("muestra cerrar sesión si está autenticado", () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(false);

    render(<Navbar />);

    expect(screen.getByText("Cerrar Sesión")).toBeInTheDocument();
  });

  it("ejecuta logout y navega si confirma", async () => {
    // Configurar usuario autenticado
    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(false);

    // Mock de confirmación
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<Navbar />);

    // Simular click en "Cerrar Sesión"
    await userEvent.click(screen.getByText("Cerrar Sesión"));

    // Verificar que se llame a logout y navigate
    expect(ApiService.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("no hace logout si cancela confirm", async () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(false);
    ApiService.isUser.mockReturnValue(false);

    // Mock de confirmación cancelada
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<Navbar />);

    await userEvent.click(screen.getByText("Cerrar Sesión"));

    // Verificar que no se llame logout ni navigate
    expect(ApiService.logout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});