import '@testing-library/jest-dom'

/**
 * Explicación:
 * - Este import extiende Jest/Vitest con matchers personalizados para el DOM.
 * - Proporciona métodos como:
 *     - toBeInTheDocument()       → verifica que un elemento exista en el DOM
 *     - toHaveTextContent()       → verifica el contenido de texto
 *     - toHaveAttribute()         → verifica atributos de un elemento
 *     - toBeVisible()             → verifica visibilidad
 * - Facilita tests más legibles y expresivos para componentes React.
 * 
 * Uso típico en tests:
 * 
 * import { render, screen } from '@testing-library/react';
 * import '@testing-library/jest-dom';
 * 
 * render(<MyComponent />);
 * expect(screen.getByText('Hola')).toBeInTheDocument();
 */