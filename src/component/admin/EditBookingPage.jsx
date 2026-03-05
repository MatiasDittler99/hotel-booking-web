import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

/**
 * EditBookingPage
 * ----------------
 * Página administrativa para visualizar el detalle completo
 * de una reserva específica y ejecutar una acción sobre ella.
 *
 * Responsabilidades:
 * - Obtener detalles de la reserva a partir del bookingCode (URL param).
 * - Mostrar información consolidada:
 *      - Datos de la reserva
 *      - Datos del usuario
 *      - Datos de la habitación
 * - Permitir ejecutar acción administrativa (cancelar / confirmar).
 * - Gestionar estados de éxito y error.
 */
const EditBookingPage = () => {

    /**
     * Hook de navegación programática.
     * Permite redirigir tras una operación exitosa.
     */
    const navigate = useNavigate();

    /**
     * Obtiene parámetros dinámicos desde la URL.
     * bookingCode identifica la reserva a consultar.
     */
    const { bookingCode } = useParams();

    /**
     * Estado principal que contiene los detalles completos
     * de la reserva obtenidos desde el backend.
     */
    const [bookingDetails, setBookingDetails] = useState(null);

    /**
     * Estado para manejo de errores.
     * Se muestra en UI y se limpia automáticamente tras timeout.
     */
    const [error, setError] = useState(null);

    /**
     * Estado para mensajes de éxito.
     * Se muestra temporalmente antes de redirección.
     */
    const [success, setSuccessMessage] = useState(null);

    /**
     * useEffect
     * ----------
     * Obtiene los detalles de la reserva cuando:
     * - El componente se monta
     * - Cambia el bookingCode en la URL
     *
     * Esto asegura sincronización entre ruta y datos.
     */
    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response =
                    await ApiService.getBookingByConfirmationCode(bookingCode);

                setBookingDetails(response.booking);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBookingDetails();
    }, [bookingCode]);

    /**
     * acheiveBooking
     * ---------------
     * Ejecuta acción administrativa sobre la reserva.
     *
     * Flujo:
     * 1. Solicita confirmación explícita del usuario.
     * 2. Llama al servicio correspondiente.
     * 3. Si es exitoso:
     *      - Muestra mensaje
     *      - Redirige al listado general
     * 4. Si falla:
     *      - Muestra error controlado
     *
     * Nota: El nombre del método podría mejorarse
     * por claridad semántica (ej. confirmBooking o cancelBooking).
     */
    const acheiveBooking = async (bookingId) => {

        // Confirmación preventiva antes de acción sensible
        if (!window.confirm('¿Estás seguro de que quieres lograr esta reserva?')) {
            return;
        }

        try {
            const response = await ApiService.cancelBooking(bookingId);

            if (response.statusCode === 200) {
                setSuccessMessage("La reserva se realizó con éxito");

                // Redirección diferida para permitir lectura del mensaje
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings');
                }, 3000);
            }
        } catch (error) {

            // Manejo robusto contemplando respuesta estructurada del backend
            setError(error.response?.data?.message || error.message);

            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Detalle de la reserva</h2>

            {/* Feedback visual de error */}
            {error && <p className='error-message'>{error}</p>}

            {/* Feedback visual de éxito */}
            {success && <p className='success-message'>{success}</p>}

            {/* Render condicional solo cuando existen datos */}
            {bookingDetails && (
                <div className="booking-details">

                    {/* =========================
                        Sección: Datos de reserva
                       ========================= */}
                    <h3>Detalles de la reserva</h3>
                    <p>Código de confirmación: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Fecha de entrada: {bookingDetails.checkInDate}</p>
                    <p>Fecha de salida: {bookingDetails.checkOutDate}</p>
                    <p>Número de adultos: {bookingDetails.numOfAdults}</p>
                    <p>Número de niños: {bookingDetails.numOfChildren}</p>
                    <p>Correo electrónico del invitado: {bookingDetails.guestEmail}</p>

                    <br />
                    <hr />
                    <br />

                    {/* =========================
                        Sección: Datos del usuario
                       ========================= */}
                    <h3>Detalles del usuario</h3>
                    <div>
                        <p>Nombre: {bookingDetails.user.name}</p>
                        <p>Correo electrónico: {bookingDetails.user.email}</p>
                        <p>Número de teléfono: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr />
                    <br />

                    {/* =========================
                        Sección: Datos de habitación
                       ========================= */}
                    <h3>Detalles de la habitación</h3>
                    <div>
                        <p>Tipo de habitación: {bookingDetails.room.roomType}</p>
                        <p>Precio de la habitación: ${bookingDetails.room.roomPrice}</p>
                        <p>Descripción de la habitación: {bookingDetails.room.roomDescription}</p>

                        {/* Imagen asociada a la habitación */}
                        <img
                            src={bookingDetails.room.roomPhotoUrl}
                            alt="Imagen de la habitación"
                        />
                    </div>

                    {/* Acción administrativa principal */}
                    <button
                        className="acheive-booking"
                        onClick={() => acheiveBooking(bookingDetails.id)}
                    >
                        Conseguir reserva
                    </button>

                </div>
            )}
        </div>
    );
};

export default EditBookingPage;