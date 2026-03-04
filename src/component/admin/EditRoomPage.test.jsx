// src/component/admin/EditRoomPage.test.jsx
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditRoomPage from './EditRoomPage';
import ApiService from '../../service/ApiService';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

// Mock useNavigate
const mockNavigate = vi.fn();

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ roomId: '1' }),
  };
});

// Mock ApiService
vi.mock('../../service/ApiService', () => ({
  default: {
    getRoomById: vi.fn(),
    updateRoom: vi.fn(),
    deleteRoom: vi.fn(),
  },
}));

describe('EditRoomPage simple tests', () => {
  const roomMock = {
    room: {
      roomPhotoUrl: 'https://example.com/photo.jpg',
      roomType: 'Single',
      roomPrice: '100',
      roomDescription: 'Habitación sencilla',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    ApiService.getRoomById.mockResolvedValue(roomMock);
    ApiService.updateRoom.mockResolvedValue({ statusCode: 200 });
    ApiService.deleteRoom.mockResolvedValue({ statusCode: 200 });
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('carga los detalles de la habitación', async () => {
    render(<MemoryRouter><EditRoomPage /></MemoryRouter>);

    await waitFor(() => expect(ApiService.getRoomById).toHaveBeenCalledWith('1'));

    expect(screen.getByDisplayValue('Single')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Habitación sencilla')).toBeInTheDocument();
    expect(screen.getByAltText('Habitación')).toBeInTheDocument();
  });

  it('actualiza la habitación', async () => {
    render(<MemoryRouter><EditRoomPage /></MemoryRouter>);

    await waitFor(() => expect(ApiService.getRoomById).toHaveBeenCalled());

    fireEvent.change(screen.getByLabelText(/Tipo de habitación/i), { target: { value: 'Double' } });
    fireEvent.change(screen.getByLabelText(/Precio de la habitación/i), { target: { value: '200' } });

    fireEvent.click(screen.getByText(/Actualizar habitación/i));

    await waitFor(() => expect(ApiService.updateRoom).toHaveBeenCalled());
  });

  it('elimina la habitación', async () => {
    render(<MemoryRouter><EditRoomPage /></MemoryRouter>);

    await waitFor(() => expect(ApiService.getRoomById).toHaveBeenCalled());

    fireEvent.click(screen.getByText(/Eliminar habitación/i));

    await waitFor(() => expect(ApiService.deleteRoom).toHaveBeenCalledWith('1'));
  });

  it('muestra vista previa al subir un archivo', async () => {
  render(<MemoryRouter><EditRoomPage /></MemoryRouter>);

  const file = new File(['dummy'], 'photo.png', { type: 'image/png' });

  const input = screen.getByTestId('room-photo-input');

  // wrap in act to evitar warnings
  await act(async () => {
    fireEvent.change(input, { target: { files: [file] } });
  });

  const previewImg = await screen.findByAltText(/Vista previa de la habitación/i);
  expect(previewImg).toBeInTheDocument();
  expect(previewImg.src).toContain('blob:');
});
});