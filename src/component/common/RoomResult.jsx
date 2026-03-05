import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para navegación programática
import ApiService from '../../service/ApiService'; // Servicio para obtener información de usuario/admin

/**
 * Componente RoomResult
 * ----------------------
 * Muestra la lista de habitaciones resultado de una búsqueda en la página principal.
 * Permite a un usuario ver y reservar, o a un administrador acceder a la edición de la sala.
 *
 * Props:
 * - roomSearchResults: Array de objetos con información de las habitaciones.
 */
const RoomResult = ({ roomSearchResults }) => {
    const navigate = useNavigate(); // Inicializa el hook useNavigate para cambiar de ruta programáticamente
    const isAdmin = ApiService.isAdmin(); // Verifica si el usuario actual es administrador

    return (
        <section className="room-results">
            {/* Verifica que existan resultados antes de renderizar */}
            {roomSearchResults && roomSearchResults.length > 0 && (
                <div className="room-list">
                    {roomSearchResults.map(room => (
                        <div key={room.id} className="room-list-item">
                            {/* Imagen de la habitación */}
                            <img
                                className='room-list-item-image'
                                src={room.roomPhotoUrl}
                                alt={room.roomType}
                            />

                            {/* Detalles de la habitación */}
                            <div className="room-details">
                                <h3>{room.roomType}</h3> {/* Tipo de habitación */}
                                <p>Precio: ${room.roomPrice} / noche</p> {/* Precio por noche */}
                                <p>Descripción: {room.roomDescription}</p> {/* Descripción breve */}
                            </div>

                            {/* Botones de acción */}
                            <div className='book-now-div'>
                                {isAdmin ? (
                                    /* Si el usuario es admin, muestra botón de edición */
                                    <button
                                        className="edit-room-button"
                                        onClick={() => navigate(`/admin/edit-room/${room.id}`)} // Navega a la página de edición con ID de sala
                                    >
                                        Sala de edición
                                    </button>
                                ) : (
                                    /* Si es usuario normal, muestra botón de ver/reservar */
                                    <button
                                        className="book-now-button"
                                        onClick={() => navigate(`/room-details-book/${room.id}`)} // Navega a detalles y reserva
                                    >
                                        Ver/Reservar ahora
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default RoomResult;