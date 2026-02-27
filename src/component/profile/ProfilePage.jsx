import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                // Fetch user bookings using the fetched user ID
                const userPlusBookings = await ApiService.getUserBookings(response.user.id);
                setUser(userPlusBookings.user)

            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="profile-page">
            {user && <h2>Bienvenido, {user.name}</h2>}
            <div className="profile-actions">
                <button className="edit-profile-button" onClick={handleEditProfile}>Editar perfil</button>
                <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {user && (
                <div className="profile-details">
                    <h3>Detalles de mi perfil</h3>
                    <p><strong>Correo electrónico:</strong> {user.email}</p>
                    <p><strong>Número de teléfono:</strong> {user.phoneNumber}</p>
                </div>
            )}
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
                                <img src={booking.room.roomPhotoUrl} alt="Habitación" className="room-photo" />
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
