import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ApiService from './ApiService';

/**
 * ProtectedRoute
 * - Ruta que solo permite acceso si el usuario está autenticado
 * - Si no lo está, redirige a /login guardando la ubicación actual
 * @param {React.Element} element - componente que se quiere renderizar
 */
export const ProtectedRoute = ({ element: Component }) => {
  const location = useLocation(); // Permite redirigir al login y luego volver a la página original

  return ApiService.isAuthenticated() ? (
    Component // Renderiza el componente si está autenticado
  ) : (
    <Navigate to="/login" replace state={{ from: location }} /> // Redirige al login
  );
};

/**
 * AdminRoute
 * - Ruta que solo permite acceso si el usuario tiene rol ADMIN
 * - Si no lo tiene, redirige a /login guardando la ubicación actual
 * @param {React.Element} element - componente que se quiere renderizar
 */
export const AdminRoute = ({ element: Component }) => {
  const location = useLocation();

  return ApiService.isAdmin() ? (
    Component // Renderiza el componente si el usuario es admin
  ) : (
    <Navigate to="/login" replace state={{ from: location }} /> // Redirige al login
  );
};