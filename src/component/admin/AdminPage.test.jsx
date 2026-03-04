// src/component/admin/AdminPage.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPage from './AdminPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';

// Mock navigate
const mockNavigate = vi.fn();

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock ApiService
vi.mock('../../service/ApiService', () => ({
  default: {
    getUserProfile: vi.fn(),
  },
}));

describe('AdminPage simple tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ApiService.getUserProfile.mockResolvedValue({
      user: { name: 'Admin Test' },
    });
  });

  it('muestra el nombre del administrador', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ApiService.getUserProfile).toHaveBeenCalled();
    });

    expect(screen.getByText(/Bienvenido, Admin Test/i)).toBeInTheDocument();
  });

  it('navega a administrar habitaciones al hacer click', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Administrar habitaciones/i));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/manage-rooms');
  });

  it('navega a gestionar reservas al hacer click', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Gestionar reservas/i));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/manage-bookings');
  });

});