import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 6;

    const navigate = useNavigate();

    // 🔹 Solo fetch (correcto usar effect acá)
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

    // 🔹 Filtrado derivado (NO es state)
    const filteredBookings = bookings.filter((booking) =>
        booking.bookingConfirmationCode &&
        booking.bookingConfirmationCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // 🔹 Paginación
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(
        indexOfFirstBooking,
        indexOfLastBooking
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

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
                        <p><strong>Código de reserva:</strong> {booking.bookingConfirmationCode}</p>
                        <p><strong>Fecha de entrada:</strong> {booking.checkInDate}</p>
                        <p><strong>Fecha de salida:</strong> {booking.checkOutDate}</p>
                        <p><strong>Invitados totales:</strong> {booking.totalNumOfGuest}</p>

                        <button
                            className="edit-room-button"
                            onClick={() =>
                                navigate(`/admin/edit-booking/${booking.bookingConfirmationCode}`)
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