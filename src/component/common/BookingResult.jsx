/**
 * BookingResult Component
 * -----------------------------------------------------------------------------
 * Componente encargado de mostrar los resultados de búsqueda de reservas.
 * Presenta cada reserva en una tarjeta con información clave y un enlace para editar.
 *
 * Props:
 * - bookingSearchResults (Array): Lista de reservas a mostrar, cada objeto debe
 *   contener los campos: id, roomId, userId, startDate, endDate, status.
 *
 * Responsabilidades principales:
 * - Renderizar un layout tipo grid responsivo para las reservas.
 * - Mostrar detalles relevantes de cada reserva.
 * - Proveer un enlace directo para edición de cada reserva.
 *
 * Dependencias:
 * - React Router `Link` para navegación a la página de edición.
 */
import React from 'react';
import { Link } from 'react-router-dom';

const BookingResult = ({ bookingSearchResults }) => {
  return (
    <div className="booking-results">
      {/* Itera sobre cada reserva y crea una tarjeta con la información */}
      {bookingSearchResults.map((booking) => (
        <div key={booking.id} className="booking-result-item">
          {/* Información de la reserva */}
          <p>ID de la habitación: {booking.roomId}</p>
          <p>ID de usuario: {booking.userId}</p>
          <p>Fecha de inicio: {booking.startDate}</p>
          <p>Fecha de finalización: {booking.endDate}</p>
          <p>Estado: {booking.status}</p>

          {/* Enlace para editar la reserva, dirigido al admin */}
          <Link
            to={`/admin/edit-booking/${booking.id}`}
            className="edit-link"
          >
            Editar
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BookingResult;