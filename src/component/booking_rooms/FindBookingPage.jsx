import React, { useState } from 'react';
import ApiService from '../../service/ApiService'; // Assuming your service is in a file called ApiService.js

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState(''); // State variable for confirmation code
    const [bookingDetails, setBookingDetails] = useState(null); // State variable for booking details
    const [error, setError] = useState(null); // Track any errors

    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            setError("Por favor, introduzca un código de confirmación de reserva");
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            // Call API to get booking details
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);
            setError(null); // Clear error if successful
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Encuentra reservas</h2>
            <div className="search-container">
                <input
                    required
                    type="text"
                    placeholder="Introduzca su código de confirmación de reserva"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                />
                <button onClick={handleSearch}>Encontrar</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Detalles de la reserva</h3>
                    <p>Código de confirmación: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Fecha de entrada: {bookingDetails.checkInDate}</p>
                    <p>Fecha de salida: {bookingDetails.checkOutDate}</p>
                    <p>Número de adultos: {bookingDetails.numOfAdults}</p>
                    <p>Número de niños: {bookingDetails.numOfChildren}</p>

                    <br />
                    <hr />
                    <br />
                    <h3>Detalles de la reserva</h3>
                    <div>
                        <p> Nombre: {bookingDetails.user.name}</p>
                        <p> Correo electrónico: {bookingDetails.user.email}</p>
                        <p> Número de teléfono: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr />
                    <br />
                    <h3>Detalles de la habitación</h3>
                    <div>
                        <p> Tipo de habitación: {bookingDetails.room.roomType}</p>
                        <img src={bookingDetails.room.roomPhotoUrl} alt="" sizes="" srcSet="" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindBookingPage;
