/**
 * AllRoomsPage Component
 * -----------------------------------------------------------------------------
 * Vista pública encargada de:
 * - Mostrar todas las habitaciones disponibles.
 * - Permitir filtrado por tipo de habitación.
 * - Permitir búsqueda avanzada mediante RoomSearch.
 * - Gestionar paginación de resultados.
 *
 * Responsabilidades principales:
 * - Orquestar datos provenientes del backend (ApiService).
 * - Gestionar estado local de filtrado y paginación.
 * - Delegar renderizado a componentes hijos especializados.
 *
 * Componentes hijos:
 * - RoomSearch (búsqueda dinámica)
 * - RoomResult (renderizado de resultados)
 * - Pagination (navegación entre páginas)
 */

import React, { useState, useEffect } from 'react';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import RoomResult from '../common/RoomResult';
import RoomSearch from '../common/RoomSearch';

const AllRoomsPage = () => {

  /**
   * Estados principales:
   * - rooms: lista completa obtenida del backend.
   * - filteredRooms: lista luego de aplicar filtros.
   * - roomTypes: tipos disponibles para filtrado.
   * - selectedRoomType: tipo actualmente seleccionado.
   * - currentPage: página actual en paginación.
   * - roomsPerPage: cantidad fija de resultados por página.
   */
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);

  /**
   * Callback recibido desde el componente RoomSearch.
   * Actualiza los resultados mostrados luego de una búsqueda.
   */
  const handleSearchResult = (results) => {
    setRooms(results);
    setFilteredRooms(results);
  };

  /**
   * useEffect ejecutado al montar el componente.
   * Se encarga de:
   * - Obtener todas las habitaciones.
   * - Obtener los tipos disponibles.
   */
  useEffect(() => {

    /**
     * Obtiene listado completo de habitaciones.
     */
    const fetchRooms = async () => {
      try {
        const response = await ApiService.getAllRooms();
        const allRooms = response.roomList;

        setRooms(allRooms);
        setFilteredRooms(allRooms);
      } catch (error) {
        console.error('Error al obtener las habitaciones:', error.message);
      }
    };

    /**
     * Obtiene tipos de habitación disponibles.
     */
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Error al obtener los tipos de habitaciones:', error.message);
      }
    };

    fetchRooms();
    fetchRoomTypes();

  }, []);

  /**
   * Maneja cambio en el select de tipo de habitación.
   * Actualiza estado y ejecuta filtrado.
   */
  const handleRoomTypeChange = (e) => {
    setSelectedRoomType(e.target.value);
    filterRooms(e.target.value);
  };

  /**
   * Filtra habitaciones según el tipo seleccionado.
   * Si no hay tipo seleccionado, restaura lista completa.
   * Reinicia paginación a la primera página.
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

    // Reinicia paginación tras aplicar filtro
    setCurrentPage(1);
  };

  /**
   * Lógica de paginación:
   * Calcula índices de corte para obtener
   * únicamente los resultados correspondientes a la página actual.
   */
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(
    indexOfFirstRoom,
    indexOfLastRoom
  );

  /**
   * Cambia página actual.
   * Recibido desde el componente Pagination.
   */
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='all-rooms'>

      {/* Título principal de la vista */}
      <h2>Todas las habitaciones</h2>

      {/* Bloque de filtrado por tipo */}
      <div className='all-room-filter-div'>
        <label>Filtrar por tipo de habitación:</label>

        <select 
          value={selectedRoomType}
          onChange={handleRoomTypeChange}
        >
          <option value="">Todo</option>

          {/* Render dinámico de tipos disponibles */}
          {roomTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Componente de búsqueda avanzada */}
      <RoomSearch handleSearchResult={handleSearchResult} />

      {/* Renderizado de resultados paginados */}
      <RoomResult roomSearchResults={currentRooms} />

      {/* Componente de paginación */}
      <Pagination
        roomsPerPage={roomsPerPage}
        totalRooms={filteredRooms.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default AllRoomsPage;