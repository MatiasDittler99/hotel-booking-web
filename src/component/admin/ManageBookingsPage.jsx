/**
 * ==========================================================
 * ManageBookingsPage Component
 * ----------------------------------------------------------
 * Vista administrativa para:
 * - Obtener todas las reservas del sistema
 * - Filtrar por código de confirmación
 * - Paginación de resultados
 * - Navegar a pantalla de gestión individual
 *
 * Responsabilidades:
 * - Fetch inicial de reservas
 * - Manejo de estado de búsqueda
 * - Lógica de paginación
 * - Renderizado de lista paginada
 *
 * Notas de arquitectura:
 * - El filtrado es estado derivado (no useState)
 * - La paginación se calcula dinámicamente
 * - Separación clara entre datos, lógica y UI
 * ==========================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';

const ManageBookingsPage = () => {

    /**
     * Estado principal con la lista completa de reservas.
     * Se llena una sola vez al montar el componente.
     */
    const [bookings, setBookings] = useState([]);

    /**
     * Estado para el término de búsqueda.
     * Se usa para filtrar por bookingConfirmationCode.
     */
    const [searchTerm, setSearchTerm] = useState('');

    /**
     * Página actual para la paginación.
     */
    const [currentPage, setCurrentPage] = useState(1);

    /**
     * Cantidad fija de reservas por página.
     * Se mantiene constante para consistencia UX.
     */
    const bookingsPerPage = 6;

    /**
     * Hook de navegación programática.
     * Se utiliza para ir a la pantalla de edición.
     */
    const navigate = useNavigate();


    /**
     * useEffect:
     * - Ejecuta el fetch inicial al montar.
     * - No depende de ningún estado (array vacío).
     * - Maneja posibles errores en consola.
     *
     * Nota: En producción podría agregarse estado de loading.
     */
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await ApiService.getAllBookings();
                setBookings(response.bookingList);
            } catch (error) {
                console.error('Error al obtener las reservas:', error.message);
            }
        };

        fetchBookings();
    }, []);


    /**
     * FILTRADO DERIVADO
     * ----------------------------------------------------------
     * No se almacena en estado porque:
     * - Depende únicamente de bookings + searchTerm
     * - Se recalcula automáticamente en cada render
     *
     * Se protege contra valores null/undefined.
     */
    const filteredBookings = bookings.filter((booking) =>
        booking.bookingConfirmationCode &&
        booking.bookingConfirmationCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );


    /**
     * LÓGICA DE PAGINACIÓN
     * ----------------------------------------------------------
     * Se calculan índices dinámicamente.
     * No se modifica el array original.
     */
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;

    const currentBookings = filteredBookings.slice(
        indexOfFirstBooking,
        indexOfLastBooking
    );


    /**
     * Función que actualiza la página actual.
     * Se pasa como prop al componente Pagination.
     */
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    /**
     * Manejo del cambio en el input de búsqueda.
     * - Actualiza searchTerm
     * - Resetea la página a 1 para evitar páginas vacías
     */
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };


    /**
     * Render principal.
     * - Input controlado para búsqueda
     * - Lista paginada de reservas
     * - Componente de paginación reutilizable
     */
    return (
        <div className='bookings-container'>
            <h2>Todas las reservas</h2>

            <div className='search-div'>
                <label>Filtrar por número de reserva:</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Introduzca el número de reserva"
                />
            </div>

            <div className="booking-results">
                {currentBookings.map((booking) => (
                    <div key={booking.id} className="booking-result-item">

                        <p>
                            <strong>Código de reserva:</strong>
                            {booking.bookingConfirmationCode}
                        </p>

                        <p>
                            <strong>Fecha de entrada:</strong>
                            {booking.checkInDate}
                        </p>

                        <p>
                            <strong>Fecha de salida:</strong>
                            {booking.checkOutDate}
                        </p>

                        <p>
                            <strong>Invitados totales:</strong>
                            {booking.totalNumOfGuest}
                        </p>

                        <button
                            className="edit-room-button"
                            onClick={() =>
                                navigate(
                                    `/admin/edit-booking/${booking.bookingConfirmationCode}`
                                )
                            }
                        >
                            Gestionar reservas
                        </button>

                    </div>
                ))}
            </div>

            <Pagination
                roomsPerPage={bookingsPerPage}
                totalRooms={filteredBookings.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default ManageBookingsPage;