import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // ================================
  // Ignorar carpetas globalmente
  // ================================
  globalIgnores(['dist']),  // No analizar la carpeta de build

  {
    files: ['**/*.{js,jsx}'],  // Archivos que serán analizados

    // ================================
    // Extends / Reglas base
    // ================================
    extends: [
      js.configs.recommended,             // Reglas recomendadas de JS moderno
      reactHooks.configs.flat.recommended,// Reglas recomendadas para Hooks de React
      reactRefresh.configs.vite,          // Integración con Vite + React Refresh
    ],

    // ================================
    // Opciones de lenguaje
    // ================================
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,           // Reconocer globals del navegador
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },      // JSX habilitado
        sourceType: 'module',             // Import/export
      },
    },

    // ================================
    // Reglas personalizadas
    // ================================
    rules: {
      // Evita error por variables no usadas
      // Ignora variables que comiencen con mayúscula o guión bajo
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])