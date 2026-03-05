import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../service/ApiService';

/**
 * AdminPage
 * ----------
 * Página principal del panel administrativo.
 * 
 * Responsabilidades:
 * - Obtener información básica del administrador autenticado.
 * - Mostrar mensaje de bienvenida personalizado.
 * - Proveer accesos rápidos a las secciones clave del sistema:
 *      - Gestión de habitaciones
 *      - Gestión de reservas
 * 
 * Este componente actúa como dashboard inicial del módulo admin.
 */
const AdminPage = () => {

    /**
     * Estado que almacena el nombre del administrador.
     * Se obtiene dinámicamente desde el backend.
     */
    const [adminName, setAdminName] = useState('');

    /**
     * Hook de navegación programática.
     * Permite redirigir a distintas rutas del panel.
     */
    const navigate = useNavigate();

    /**
     * useEffect
     * ----------
     * Ejecuta la obtención del perfil del usuario al montar el componente.
     * 
     * - Se realiza una llamada al backend mediante ApiService.
     * - Se extrae el nombre del usuario autenticado.
     * - En caso de error, se registra en consola (no bloquea render).
     * 
     * Dependencias:
     * - Array vacío → solo se ejecuta una vez (componentDidMount equivalent).
     */
    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setAdminName(response.user.name);
            } catch (error) {
                console.error(
                    'Error al obtener los detalles del administrador:',
                    error.message
                );
            }
        };

        fetchAdminName();
    }, []);

    return (
        <div className="admin-page">

            {/* 
                Mensaje de bienvenida dinámico.
                Refuerza personalización y contexto de usuario autenticado.
            */}
            <h1 className="welcome-message">
                Bienvenido, {adminName}
            </h1>

            {/* 
                Sección de acciones principales del administrador.
                Botones de navegación hacia módulos críticos del sistema.
            */}
            <div className="admin-actions">

                {/* 
                    Navega al módulo de gestión de habitaciones.
                    Permite crear, editar o eliminar habitaciones.
                */}
                <button 
                    className="admin-button" 
                    onClick={() => navigate('/admin/manage-rooms')}
                >
                    Administrar habitaciones
                </button>

                {/* 
                    Navega al módulo de gestión de reservas.
                    Permite visualizar y administrar bookings existentes.
                */}
                <button 
                    className="admin-button" 
                    onClick={() => navigate('/admin/manage-bookings')}
                >
                    Gestionar reservas
                </button>

            </div>
        </div>
    );
}

export default AdminPage;