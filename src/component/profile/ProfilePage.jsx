import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

/**
 * ProfilePage Component
 * Este componente maneja la visualización del perfil del usuario junto con su historial de reservas.
 * Incluye funcionalidades para editar el perfil y cerrar sesión.
 */
const ProfilePage = () => {
    // Estado para almacenar los datos del usuario
    const [user, setUser] = useState(null);
    // Estado para almacenar errores de la API
    const [error, setError] = useState(null);
    // Hook de React Router para navegación programática
    const navigate = useNavigate();

    /**
     * useEffect para obtener los datos del usuario al montar el componente
     * - Llama a la API para obtener el perfil del usuario
     * - Luego obtiene las reservas asociadas a ese usuario
     * - Maneja errores y los muestra en pantalla
     */
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Petición a la API para obtener datos del usuario
                const response = await ApiService.getUserProfile();
                // Petición a la API para obtener las reservas del usuario
                const userPlusBookings = await ApiService.getUserBookings(response.user.id);
                // Actualiza el estado con los datos completos del usuario
                setUser(userPlusBookings.user);

            } catch (error) {
                // Manejo de errores de forma robusta, considerando response.data.message
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchUserProfile();
    }, []); // Dependencias vacías: se ejecuta solo una vez al montar el componente

    /**
     * handleLogout
     * Función para cerrar sesión del usuario
     * - Llama a la API de logout
     * - Redirige a la página de inicio
     */
    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    /**
     * handleEditProfile
     * Función para redirigir a la página de edición de perfil
     */
    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="profile-page">
            {/* Bienvenida personalizada */}
            {user && <h2>Bienvenido, {user.name}</h2>}

            {/* Botones de acción del perfil */}
            <div className="profile-actions">
                <button className="edit-profile-button" onClick={handleEditProfile}>
                    Editar perfil
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>

            {/* Mensaje de error */}
            {error && <p className="error-message">{error}</p>}

            {/* Detalles del perfil */}
            {user && (
                <div className="profile-details">
                    <h3>Detalles de mi perfil</h3>
                    <p><strong>Correo electrónico:</strong> {user.email}</p>
                    <p><strong>Número de teléfono:</strong> {user.phoneNumber}</p>
                </div>
            )}

            {/* Historial de reservas */}
            <div className="bookings-section">
                <h3>Mi historial de reservas</h3>
                <div className="booking-list">
                    {user && user.bookings.length > 0 ? (
                        user.bookings.map((booking) => (
                            <div key={booking.id} className="booking-item">
                                <p><strong>Código de reserva:</strong> {booking.bookingConfirmationCode}</p>
                                <p><strong>Fecha de entrada:</strong> {booking.checkInDate}</p>
                                <p><strong>Fecha de salida:</strong> {booking.checkOutDate}</p>
                                <p><strong>Invitados totales:</strong> {booking.totalNumOfGuest}</p>
                                <p><strong>Tipo de habitación:</strong> {booking.room.roomType}</p>
                                <img
                                    src={booking.room.roomPhotoUrl}
                                    alt="Habitación"
                                    className="room-photo"
                                />
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron reservas.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;