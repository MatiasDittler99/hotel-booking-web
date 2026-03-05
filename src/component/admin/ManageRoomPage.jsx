/**
 * ==========================================================
 * ManageRoomPage Component
 * ----------------------------------------------------------
 * Vista administrativa para:
 * - Obtener todas las habitaciones
 * - Filtrar por tipo
 * - Paginación de resultados
 * - Navegar a creación de nueva habitación
 *
 * Responsabilidades:
 * - Fetch inicial de habitaciones y tipos
 * - Manejo de estado de filtrado
 * - Control de paginación
 * - Delegar renderizado de resultados a RoomResult
 *
 * Diseño:
 * - Separación clara entre datos (rooms),
 *   vista filtrada (filteredRooms)
 *   y paginación (currentRooms)
 * ==========================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import RoomResult from '../common/RoomResult';

const ManageRoomPage = () => {

  /**
   * Estado con todas las habitaciones obtenidas del backend.
   */
  const [rooms, setRooms] = useState([]);

  /**
   * Estado con habitaciones filtradas.
   * Se mantiene separado de rooms para evitar recalcular
   * el filtro en cada render.
   */
  const [filteredRooms, setFilteredRooms] = useState([]);

  /**
   * Lista de tipos de habitación para el select.
   */
  const [roomTypes, setRoomTypes] = useState([]);

  /**
   * Tipo de habitación actualmente seleccionado.
   */
  const [selectedRoomType, setSelectedRoomType] = useState('');

  /**
   * Página actual de paginación.
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Cantidad fija de habitaciones por página.
   * Se define como constante de estado para estabilidad.
   */
  const [roomsPerPage] = useState(5);

  /**
   * Hook de navegación programática.
   */
  const navigate = useNavigate();


  /**
   * useEffect:
   * - Ejecuta fetch inicial al montar.
   * - Obtiene habitaciones y tipos en paralelo.
   *
   * Nota: En entornos más complejos podría utilizarse
   * Promise.all para optimizar ambas llamadas.
   */
  useEffect(() => {

    const fetchRooms = async () => {
      try {
        const response = await ApiService.getAllRooms();
        const allRooms = response.roomList;

        // Inicializa estado principal y filtrado
        setRooms(allRooms);
        setFilteredRooms(allRooms);

      } catch (error) {
        console.error(
          'Error al obtener las habitaciones:',
          error.message
        );
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error(
          'Error al obtener los tipos de habitaciones:',
          error.message
        );
      }
    };

    fetchRooms();
    fetchRoomTypes();

  }, []);


  /**
   * Maneja cambio del select.
   * - Actualiza tipo seleccionado
   * - Dispara filtrado
   */
  const handleRoomTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedRoomType(selectedType);
    filterRooms(selectedType);
  };


  /**
   * Lógica de filtrado.
   * - Si no hay tipo seleccionado → muestra todas
   * - Si hay tipo → filtra por coincidencia exacta
   * - Resetea paginación a página 1
   */
  const filterRooms = (type) => {

    if (type === '') {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(
        (room) => room.roomType === type
      );
      setFilteredRooms(filtered);
    }

    // Reset a primera página tras aplicar filtro
    setCurrentPage(1);
  };


  /**
   * -------------------------------
   * LÓGICA DE PAGINACIÓN
   * -------------------------------
   * Se calculan índices dinámicamente
   * sobre la lista filtrada.
   */
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;

  const currentRooms =
    filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);


  /**
   * Cambia página actual.
   * Se pasa como prop al componente Pagination.
   */
  const paginate = (pageNumber) =>
    setCurrentPage(pageNumber);


  /**
   * Render principal.
   * - Filtro por tipo
   * - Botón para añadir habitación
   * - Lista paginada
   * - Componente reutilizable de paginación
   */
  return (
    <div className='all-rooms'>

      <h2>Todas las habitaciones</h2>

      <div
        className='all-room-filter-div'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >

        <div className='filter-select-div'>

          <label htmlFor="roomTypeSelect">
            Filtrar por tipo de habitación:
          </label>

          <select
            id="roomTypeSelect"
            value={selectedRoomType}
            onChange={handleRoomTypeChange}
          >
            <option value="">Todo</option>

            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}

          </select>

          <button
            className='add-room-button'
            onClick={() => navigate('/admin/add-room')}
          >
            Añadir habitación
          </button>

        </div>

      </div>

      {/* 
        Delegación del renderizado de habitaciones
        a componente especializado.
        Mejora separación de responsabilidades.
      */}
      <RoomResult roomSearchResults={currentRooms} />

      <Pagination
        roomsPerPage={roomsPerPage}
        totalRooms={filteredRooms.length}
        currentPage={currentPage}
        paginate={paginate}
      />

    </div>
  );
};

export default ManageRoomPage;