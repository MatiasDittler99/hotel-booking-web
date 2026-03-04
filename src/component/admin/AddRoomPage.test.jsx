// src/component/admin/AddRoomPage.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddRoomPage from './AddRoomPage';
import { BrowserRouter } from 'react-router-dom';
import ApiService from '../../service/ApiService';

// Mock del ApiService
vi.mock('../../service/ApiService', () => ({
  default: {
    getRoomTypes: vi.fn().mockResolvedValue(['Single', 'Double']),
    addRoom: vi.fn().mockResolvedValue({ statusCode: 200 }),
  },
}));

// Mock de window.confirm
vi.stubGlobal('confirm', vi.fn(() => true));

const renderComponent = () =>
  render(
    <BrowserRouter>
      <AddRoomPage />
    </BrowserRouter>
  );

describe('AddRoomPage simple tests', () => {
  it('renderiza el formulario', async () => {
    renderComponent();
    expect(screen.getByText(/Agregar nueva habitación/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText(/Tipo de habitación/i)).toBeInTheDocument();
    });
  });

  it('muestra error si los campos están vacíos', async () => {
    renderComponent();
    const button = screen.getByText(/Añadir habitación/i);
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText(/Se deben proporcionar todos los detalles/i)).toBeInTheDocument();
    });
  });

  it('permite ingresar datos en los inputs', async () => {
    renderComponent();
    const priceInput = screen.getByLabelText(/Precio de la habitación/i);
    fireEvent.change(priceInput, { target: { value: '100' } });
    expect(priceInput.value).toBe('100');

    const descInput = screen.getByLabelText(/Descripción de la habitación/i);
    fireEvent.change(descInput, { target: { value: 'Habitación grande' } });
    expect(descInput.value).toBe('Habitación grande');
  });
});