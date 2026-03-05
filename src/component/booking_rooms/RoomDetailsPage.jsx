/**
 * RoomDetailsPage Component
 * -----------------------------------------------------------------------------
 * Página de detalle de habitación.
 *
 * Responsabilidades principales:
 * - Mostrar información completa de la habitación (tipo, precio, descripción, foto).
 * - Mostrar reservas existentes asociadas a la habitación.
 * - Permitir selección de fechas de check-in y check-out.
 * - Permitir ingreso de número de adultos y niños para la reserva.
 * - Calcular precio total y total de invitados.
 * - Confirmar y aceptar reserva a través del ApiService.
 * - Manejar errores y mostrar mensajes de éxito.
 *
 * Dependencias externas:
 * - react-datepicker para selección de fechas.
 * - ApiService para llamadas a la API.
 * - useNavigate y useParams de react-router-dom para navegación y parámetros de URL.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

const RoomDetailsPage = () => {
  /** Hook de navegación */
  const navigate = useNavigate();

  /** Parámetro de URL: ID de la habitación */
  const { roomId } = useParams();

  /** Estados principales */
  const [roomDetails, setRoomDetails] = useState(null); // Información completa de la habitación
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Mensaje de error global
  const [checkInDate, setCheckInDate] = useState(null); // Fecha de check-in seleccionada
  const [checkOutDate, setCheckOutDate] = useState(null); // Fecha de check-out seleccionada
  const [numAdults, setNumAdults] = useState(1); // Número de adultos
  const [numChildren, setNumChildren] = useState(0); // Número de niños
  const [totalPrice, setTotalPrice] = useState(0); // Precio total de la reserva
  const [totalGuests, setTotalGuests] = useState(1); // Número total de invitados
  const [showDatePicker, setShowDatePicker] = useState(false); // Mostrar u ocultar DatePicker
  const [userId, setUserId] = useState(''); // ID del usuario actual
  const [showMessage, setShowMessage] = useState(false); // Mostrar mensaje de éxito
  const [confirmationCode, setConfirmationCode] = useState(''); // Código de confirmación de la reserva
  const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error local

  /**
   * useEffect principal
   * -----------------------------------------------------------------------------
   * - Obtiene detalles de la habitación desde la API según roomId.
   * - Obtiene perfil del usuario actual para registrar la reserva.
   * - Maneja estado de carga y errores.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [roomId]);

  /**
   * handleConfirmBooking
   * -----------------------------------------------------------------------------
   * - Valida fechas seleccionadas y número de huéspedes.
   * - Calcula total de días, invitados y precio total.
   * - Actualiza estados correspondientes.
   */
  const handleConfirmBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Por favor seleccione las fechas de entrada y salida.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    if (isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
      setErrorMessage('Introduzca números válidos para adultos y niños.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

    const totalGuests = numAdults + numChildren;
    const roomPricePerNight = roomDetails.roomPrice;
    const totalPrice = roomPricePerNight * totalDays;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
  };

  /**
   * acceptBooking
   * -----------------------------------------------------------------------------
   * - Formatea fechas para compatibilidad con la API.
   * - Crea objeto de reserva y envía petición a ApiService.
   * - Muestra mensaje de éxito y redirige a la página de habitaciones.
   * - Maneja errores de API.
   */
  const acceptBooking = async () => {
    try {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000))
        .toISOString().split('T')[0];
      const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000))
        .toISOString().split('T')[0];

      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numAdults,
        numOfChildren: numChildren
      };

      const response = await ApiService.bookRoom(roomId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          navigate('/rooms');
        }, 10000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  /** Renderizado condicional basado en estado de carga y errores */
  if (isLoading) return <p className='room-detail-loading'>Cargando detalles de la sala...</p>;
  if (error) return <p className='room-detail-loading'>{error}</p>;
  if (!roomDetails) return <p className='room-detail-loading'>Habitación no encontrada.</p>;

  const { roomType, roomPrice, roomPhotoUrl, description, bookings } = roomDetails;

  return (
    <div className="room-details-booking">
      {/* Mensaje de reserva exitosa */}
      {showMessage && (
        <p className="booking-success-message">
          ¡Reserva realizada! Código de confirmación: {confirmationCode}. Se le ha enviado un SMS y un correo electrónico con los detalles de su reserva.
        </p>
      )}

      {/* Mensaje de error local */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Información general de la habitación */}
      <h2>Detalles de la habitación</h2>
      <br />
      <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
      <div className="room-details-info">
        <h3>{roomType}</h3>
        <p>Precio: ${roomPrice} / noche</p>
        <p>{description}</p>
      </div>

      {/* Reservas existentes */}
      {bookings && bookings.length > 0 && (
        <div>
          <h3>Detalles de la reserva existente</h3>
          <ul className="booking-list">
            {bookings.map((booking, index) => (
              <li key={booking.id} className="booking-item">
                <span className="booking-number">Reserva {index + 1} </span>
                <span className="booking-text">Registrarse: {booking.checkInDate} </span>
                <span className="booking-text">Afuera: {booking.checkOutDate}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sección de reservas */}
      <div className="booking-info">
        <button className="book-now-button" onClick={() => setShowDatePicker(true)}>Reservar ahora</button>
        <button className="go-back-button" onClick={() => setShowDatePicker(false)}>Volver</button>

        {/* Selector de fechas y número de invitados */}
        {showDatePicker && (
          <div className="date-picker-container">
            <DatePicker
              className="detail-search-field"
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              placeholderText="Fecha de entrada"
              dateFormat="dd/MM/yyyy"
            />
            <DatePicker
              className="detail-search-field"
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate}
              placeholderText="Fecha de salida"
              dateFormat="dd/MM/yyyy"
            />

            <div className='guest-container'>
              <div className="guest-div">
                <label>Adultos:</label>
                <input
                  type="number"
                  min="1"
                  value={numAdults}
                  onChange={(e) => setNumAdults(parseInt(e.target.value))}
                />
              </div>
              <div className="guest-div">
                <label>Niños:</label>
                <input
                  type="number"
                  min="0"
                  value={numChildren}
                  onChange={(e) => setNumChildren(parseInt(e.target.value))}
                />
              </div>
              <button className="confirm-booking" onClick={handleConfirmBooking}>Confirmar reserva</button>
            </div>
          </div>
        )}

        {/* Resumen de precio y botón final de confirmación */}
        {totalPrice > 0 && (
          <div className="total-price">
            <p>Precio total: ${totalPrice}</p>
            <p>Invitados totales: {totalGuests}</p>
            <button onClick={acceptBooking} className="accept-booking">Aceptar reserva</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;