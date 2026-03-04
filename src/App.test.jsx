import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import App from './App'

describe('App', () => {
  test('renderiza correctamente el footer con el símbolo ©', () => {
    render(<App />)

    const copyrightElement = screen.getByText(/©/)

    expect(copyrightElement).toBeInTheDocument()
  })
})