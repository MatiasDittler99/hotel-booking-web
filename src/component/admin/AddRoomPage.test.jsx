// src/component/admin/AddRoomPage.test.jsx

/**
 * Test Suite: AddRoomPage
 * ------------------------
 * Pruebas unitarias básicas del componente AddRoomPage.
 * 
 * Objetivos:
 *  - Verificar renderizado inicial del formulario
 *  - Validar comportamiento ante envío con campos vacíos
 *  - Confirmar correcta interacción con inputs controlados
 * 
 * Se mockea:
 *  - ApiService para aislar el componente del backend
 *  - window.confirm para evitar interacción real del usuario
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddRoomPage from './AddRoomPage';
import { BrowserRouter } from 'react-router-dom';
import ApiService from '../../service/ApiService';

/**
 * Mock del ApiService
 * --------------------
 * Se simulan respuestas exitosas para:
 *  - getRoomTypes → devuelve lista predefinida
 *  - addRoom → devuelve statusCode 200
 * 
 * Esto garantiza:
 *  - Aislamiento del entorno externo
 *  - Tests determinísticos
 *  - Ejecución rápida sin llamadas HTTP reales
 */
vi.mock('../../service/ApiService', () => ({
  default: {
    getRoomTypes: vi.fn().mockResolvedValue(['Single', 'Double']),
    addRoom: vi.fn().mockResolvedValue({ statusCode: 200 }),
  },
}));

/**
 * Stub global de window.confirm
 * -------------------------------
 * Se fuerza a retornar true para evitar bloqueos
 * durante la ejecución del test.
 */
vi.stubGlobal('confirm', vi.fn(() => true));

/**
 * Helper de renderizado
 * ----------------------
 * Envuelve el componente con BrowserRouter ya que:
 *  - AddRoomPage utiliza useNavigate
 *  - Requiere contexto de routing
 */
const renderComponent = () =>
  render(
    <BrowserRouter>
      <AddRoomPage />
    </BrowserRouter>
  );

describe('AddRoomPage simple tests', () => {

  /**
   * Test 1:
   * Verifica que el formulario se renderice correctamente.
   * 
   * Incluye espera asíncrona debido a:
   *  - useEffect que obtiene tipos de habitación
   */
  it('renderiza el formulario', async () => {
    renderComponent();

    // Verifica título principal
    expect(screen.getByText(/Agregar nueva habitación/i)).toBeInTheDocument();

    // Espera a que el select esté disponible tras el fetch mockeado
    await waitFor(() => {
      expect(screen.getByLabelText(/Tipo de habitación/i)).toBeInTheDocument();
    });
  });

  /**
   * Test 2:
   * Verifica validación básica cuando se intenta enviar
   * el formulario con campos obligatorios vacíos.
   */
  it('muestra error si los campos están vacíos', async () => {
    renderComponent();

    const button = screen.getByText(/Añadir habitación/i);

    // Simula click sin completar formulario
    fireEvent.click(button);

    // Espera aparición del mensaje de error
    await waitFor(() => {
      expect(
        screen.getByText(/Se deben proporcionar todos los detalles/i)
      ).toBeInTheDocument();
    });
  });

  /**
   * Test 3:
   * Verifica que los inputs controlados actualicen correctamente su estado.
   * 
   * Se valida:
   *  - Campo de precio
   *  - Campo de descripción
   */
  it('permite ingresar datos en los inputs', async () => {
    renderComponent();

    // Test input precio
    const priceInput = screen.getByLabelText(/Precio de la habitación/i);
    fireEvent.change(priceInput, { target: { value: '100' } });
    expect(priceInput.value).toBe('100');

    // Test textarea descripción
    const descInput = screen.getByLabelText(/Descripción de la habitación/i);
    fireEvent.change(descInput, { target: { value: 'Habitación grande' } });
    expect(descInput.value).toBe('Habitación grande');
  });
});