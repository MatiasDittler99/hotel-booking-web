// src/component/booking_rooms/FindBookingPage.jsx

/**
 * FindBookingPage Component
 * -----------------------------------------------------------------------------
 * Vista encargada de permitir a un usuario encontrar una reserva mediante
 * un código de confirmación. Proporciona búsqueda, validación, manejo de
 * errores y visualización de los detalles de la reserva.
 *
 * Responsabilidades principales:
 * - Gestionar estado local de código de confirmación, detalles de reserva y errores.
 * - Validar entrada de usuario antes de llamar a la API.
 * - Consultar ApiService para obtener los datos de la reserva.
 * - Renderizar detalles de la reserva, usuario y habitación de forma clara.
 *
 * Componentes internos / bloques:
 * - Input para código de confirmación.
 * - Botón para ejecutar búsqueda.
 * - Mensajes de error temporales.
 * - Contenedores para mostrar detalles de reserva, usuario y habitación.
 */

import React, { useState } from 'react';
import ApiService from '../../service/ApiService'; // Servicio para llamadas a la API

const FindBookingPage = () => {

    /**
     * Estados principales:
     * -----------------------------------------------------------------------------
     * - confirmationCode: string | Código de confirmación ingresado por el usuario.
     * - bookingDetails: object|null | Información de la reserva obtenida desde la API.
     * - error: string|null | Mensaje de error a mostrar si ocurre algún problema.
     */
    const [confirmationCode, setConfirmationCode] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);

    /**
     * handleSearch
     * -----------------------------------------------------------------------------
     * Función asíncrona que ejecuta la búsqueda de la reserva:
     * 1. Valida que el código de confirmación no esté vacío.
     * 2. Llama a ApiService.getBookingByConfirmationCode() para obtener datos.
     * 3. Actualiza el estado de bookingDetails si la búsqueda es exitosa.
     * 4. Maneja errores y muestra mensajes temporales durante 5 segundos.
     */
    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            setError("Por favor, introduzca un código de confirmación de reserva");
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);
            setError(null); // Limpiar error si la búsqueda fue exitosa
        } catch (error) {
            // Captura mensaje de error de API o error general
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    /**
     * Renderizado del componente
     * -----------------------------------------------------------------------------
     * 1. Contenedor principal con clase "find-booking-page".
     * 2. Título de la página.
     * 3. Bloque de búsqueda con input y botón.
     * 4. Mensaje de error (si existe).
     * 5. Detalles de la reserva (si bookingDetails tiene datos):
     *    - Información general de la reserva.
     *    - Información del usuario.
     *    - Información de la habitación, incluyendo imagen.
     */
    return (
        <div className="find-booking-page">

            {/* Título principal de la vista */}
            <h2>Encuentra reservas</h2>

            {/* Bloque de búsqueda */}
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

            {/* Mensaje de error temporal */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Renderizado de detalles de la reserva */}
            {bookingDetails && (
                <div className="booking-details">

                    {/* Información general de la reserva */}
                    <h3>Detalles de la reserva</h3>
                    <p>Código de confirmación: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Fecha de entrada: {bookingDetails.checkInDate}</p>
                    <p>Fecha de salida: {bookingDetails.checkOutDate}</p>
                    <p>Número de adultos: {bookingDetails.numOfAdults}</p>
                    <p>Número de niños: {bookingDetails.numOfChildren}</p>

                    <br />
                    <hr />
                    <br />

                    {/* Información del usuario */}
                    <h3>Detalles del usuario</h3>
                    <div>
                        <p>Nombre: {bookingDetails.user.name}</p>
                        <p>Correo electrónico: {bookingDetails.user.email}</p>
                        <p>Número de teléfono: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr />
                    <br />

                    {/* Información de la habitación */}
                    <h3>Detalles de la habitación</h3>
                    <div>
                        <p>Tipo de habitación: {bookingDetails.room.roomType}</p>
                        <img src={bookingDetails.room.roomPhotoUrl} alt="Foto de la habitación" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindBookingPage;