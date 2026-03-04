// src/component/auth/RegisterPage.simple.test.jsx
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterPage from './RegisterPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../service/ApiService', () => ({
  default: { registerUser: vi.fn() },
}));

describe('RegisterPage simple test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('llama a ApiService.registerUser con los datos correctos', () => {
    ApiService.registerUser.mockResolvedValue({ statusCode: 200 });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre:/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico:/i), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByLabelText(/Número de teléfono:/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Contraseña:/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

    // Solo verificamos que se llamó a la función con los datos correctos
    expect(ApiService.registerUser).toHaveBeenCalledWith({
      name: 'Juan',
      email: 'juan@test.com',
      password: '123456',
      phoneNumber: '1234567890',
    });
  });
});