import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../service/ApiService';

/**
 * Componente RoomSearch
 * Permite al usuario buscar habitaciones disponibles según:
 *  - Fecha de entrada
 *  - Fecha de salida
 *  - Tipo de habitación
 * 
 * Props:
 *  - handleSearchResult: función callback que recibe la lista de habitaciones encontradas
 */
const RoomSearch = ({ handleSearchResult }) => {
  // 🔹 Estados locales
  const [startDate, setStartDate] = useState(null); // Fecha de entrada seleccionada
  const [endDate, setEndDate] = useState(null);     // Fecha de salida seleccionada
  const [roomType, setRoomType] = useState('');     // Tipo de habitación seleccionado
  const [roomTypes, setRoomTypes] = useState([]);   // Lista de tipos de habitaciones disponibles
  const [error, setError] = useState('');           // Mensaje de error para mostrar al usuario

  /**
   * useEffect para obtener los tipos de habitaciones desde la API al montar el componente
   */
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes(); // Llamada a la API
        setRoomTypes(types);                           // Guardamos los tipos de habitaciones
      } catch (error) {
        console.error('Error al obtener los tipos de habitaciones:', error.message);
      }
    };
    fetchRoomTypes();
  }, []); // Dependencias vacías: solo se ejecuta al montar

  /**
   * Función para mostrar errores temporales al usuario
   * @param {string} message - Mensaje de error
   * @param {number} timeout - Tiempo en ms que dura visible el mensaje
   */
  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError(''); // Limpiar mensaje después del timeout
    }, timeout);
  };

  /**
   * Función interna para manejar la búsqueda de habitaciones
   * Valida que los campos estén completos y llama a la API
   */
  const handleInternalSearch = async () => {
    // 🔹 Validación de campos obligatorios
    if (!startDate || !endDate || !roomType) {
      showError('Por favor seleccione todos los campos');
      return false;
    }

    try {
      // 🔹 Convertir fechas al formato ISO yyyy-mm-dd
      const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

      // 🔹 Llamada a la API para obtener habitaciones disponibles
      const response = await ApiService.getAvailableRoomsByDateAndType(
        formattedStartDate,
        formattedEndDate,
        roomType
      );

      // 🔹 Manejo de la respuesta de la API
      if (response.statusCode === 200) {
        if (response.roomList.length === 0) {
          showError('Habitación no disponible actualmente para este rango de fechas en el tipo de habitación seleccionado.');
          return;
        }
        handleSearchResult(response.roomList); // Pasar resultados al componente padre
        setError('');                           // Limpiar cualquier error previo
      }
    } catch (error) {
      // 🔹 Manejo de errores de la API
      showError("Se produjo un error desconocido: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <section>
      {/* 🔹 Contenedor principal del buscador */}
      <div className="search-container">
        {/* Campo de fecha de entrada */}
        <div className="search-field">
          <label>Fecha de entrada</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Seleccione la fecha de entrada"
          />
        </div>

        {/* Campo de fecha de salida */}
        <div className="search-field">
          <label>Fecha de salida</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Seleccione la fecha de salida"
          />
        </div>

        {/* Campo de selección de tipo de habitación */}
        <div className="search-field">
          <label>Tipo de habitación</label>
          <select value={roomType} onChange={(e) => {setRoomType(e.target.value); e.target.size = 1}} onFocus={(e) => (e.target.size = 4)} onBlur={(e) => (e.target.size = 1)}>
            <option disabled value="">
              Seleccione el tipo de habitación
            </option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Botón de búsqueda */}
        <button className="home-search-button" onClick={handleInternalSearch}>
          Buscar habitaciones
        </button>
      </div>

      {/* 🔹 Mensaje de error */}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
};

export default RoomSearch;