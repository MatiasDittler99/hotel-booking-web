import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

function Navbar() {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        const isLogout = window.confirm('¿Está seguro de que desea cerrar la sesión de este usuario?');
        if (isLogout) {
            ApiService.logout();
            navigate('/home');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/home">Roomly Stay</NavLink>
            </div>
            <ul className="navbar-ul">
                <li><NavLink to="/home" activeclassname="active">Inicio</NavLink></li>
                <li><NavLink to="/rooms" activeclassname="active">Habitaciones</NavLink></li>
                <li><NavLink to="/find-booking" activeclassname="active">Buscar Reserva</NavLink></li>

                {isUser && <li><NavLink to="/profile" activeclassname="active">Perfil</NavLink></li>}
                {isAdmin && <li><NavLink to="/admin" activeclassname="active">Administración</NavLink></li>}

                {!isAuthenticated &&<li><NavLink to="/login" activeclassname="active">Iniciar Sesión</NavLink></li>}
                {!isAuthenticated &&<li><NavLink to="/register" activeclassname="active">Registrarse</NavLink></li>}
                {isAuthenticated && <li onClick={handleLogout}>Cerrar Sesión</li>}
            </ul>
        </nav>
    );
}

export default Navbar;
