import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
const mockLocation = { state: { from: { pathname: '/dashboard' } } };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

vi.mock('../../service/ApiService', () => ({
  default: { loginUser: vi.fn() },
}));

describe('LoginPage simple test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('llama a ApiService.loginUser con los datos correctos y guarda token', async () => {
    ApiService.loginUser.mockResolvedValue({
      statusCode: 200,
      token: 'fake-token',
      role: 'admin'
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo electrónico:/i), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña:/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    // Esperamos que se ejecute la promesa de login
    await waitFor(() => {
      // Verificamos llamada al API
      expect(ApiService.loginUser).toHaveBeenCalledWith({
        email: 'juan@test.com',
        password: '123456',
      });

      // Verificamos que se guardó token y rol
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('role')).toBe('admin');

      // Verificamos la navegación
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });
});