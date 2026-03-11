import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

/**
 * Componente Navbar
 * -----------------
 * Barra de navegación principal de la aplicación.
 * Se encarga de:
 * - Mostrar links principales según el estado de autenticación del usuario.
 * - Resaltar la sección activa mediante NavLink.
 * - Manejar el cierre de sesión.
 */
function Navbar() {
    // Determinar estado de autenticación y roles
    const isAuthenticated = ApiService.isAuthenticated(); // Usuario logueado
    const isAdmin = ApiService.isAdmin(); // Usuario administrador
    const isUser = ApiService.isUser(); // Usuario normal
    const navigate = useNavigate(); // Hook para navegación programática

    /**
     * handleLogout
     * -------------
     * Función que maneja el cierre de sesión.
     * - Pide confirmación al usuario
     * - Llama al servicio de logout
     * - Redirige al home
     */
    const handleLogout = () => {
        const isLogout = window.confirm('¿Está seguro de que desea cerrar la sesión de este usuario?');
        if (isLogout) {
            ApiService.logout();
            navigate('/home');
        }
    };

    return (
        <nav className="navbar">
            {/* Branding / Logo */}
            <div className="navbar-brand">
                <NavLink to="/home">Roomly Stay</NavLink>
            </div>

            {/* Lista de navegación */}
            <ul className="navbar-ul">
                {/* Links públicos */}
                <li>
                    <NavLink to="/home" activeclassname="active">
                        Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/rooms" activeclassname="active">
                        Habitaciones
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/find-booking" activeclassname="active">
                        Buscar Reserva
                    </NavLink>
                </li>

                {/* Links para usuarios logueados */}
                {isUser && (
                    <li>
                        <NavLink to="/profile" activeclassname="active">
                            Perfil
                        </NavLink>
                    </li>
                )}

                {/* Links para administradores */}
                {isAdmin && (
                    <li>
                        <NavLink to="/admin" activeclassname="active">
                            Administración
                        </NavLink>
                    </li>
                )}

                {/* Links para usuarios no autenticados */}
                {!isAuthenticated && (
                    <>
                        <li>
                            <NavLink to="/login" activeclassname="active">
                                Iniciar Sesión
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/register" activeclassname="active">
                                Registrarse
                            </NavLink>
                        </li>
                    </>
                )}

                {/* Botón de cerrar sesión para usuarios autenticados */}
                {isAuthenticated && (
                    <li>
                        <button className="navbar-link-button" onClick={handleLogout}>
                            Cerrar Sesión
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
