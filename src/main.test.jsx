import { describe, test, expect} from 'vitest'

describe('main.jsx', () => {
  test('monta la aplicación sin errores', async () => {
    const rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)

    await import('./main.jsx')

    expect(document.getElementById('root')).toBeTruthy()
  })
})