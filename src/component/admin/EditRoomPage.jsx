/**
 * ==========================================================
 * EditRoomPage Component
 * ----------------------------------------------------------
 * Pantalla de administración para:
 * - Obtener datos de una habitación por ID
 * - Editar información y foto
 * - Actualizar la habitación
 * - Eliminar la habitación
 *
 * Responsabilidades:
 * - Manejo de estado local del formulario
 * - Integración con ApiService
 * - Gestión de preview de imagen
 * - Manejo de feedback visual (success / error)
 * - Navegación post-acción
 * ==========================================================
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditRoomPage = () => {

    /**
     * Obtiene el parámetro dinámico de la URL.
     * Se utiliza para identificar qué habitación editar.
     */
    const { roomId } = useParams();

    /**
     * Hook para navegación programática
     * utilizado luego de actualizar o eliminar.
     */
    const navigate = useNavigate();

    /**
     * Estado principal del formulario.
     * Representa los campos editables de la habitación.
     */
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });

    /**
     * Estado para archivo seleccionado.
     * Se almacena como File para enviarlo en FormData.
     */
    const [file, setFile] = useState(null);

    /**
     * Estado para preview de imagen.
     * Se genera dinámicamente mediante URL.createObjectURL().
     */
    const [preview, setPreview] = useState(null);

    /**
     * Estados de feedback para UX.
     * Se limpian automáticamente luego de cierto tiempo.
     */
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    /**
     * useEffect:
     * - Se ejecuta al montar el componente
     * - Vuelve a ejecutarse si cambia roomId
     * - Obtiene los datos actuales de la habitación
     */
    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await ApiService.getRoomById(roomId);

                // Normaliza y setea el estado del formulario
                setRoomDetails({
                    roomPhotoUrl: response.room.roomPhotoUrl,
                    roomType: response.room.roomType,
                    roomPrice: response.room.roomPrice,
                    roomDescription: response.room.roomDescription,
                });
            } catch (error) {
                // Manejo seguro de errores con optional chaining
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchRoomDetails();
    }, [roomId]);


    /**
     * Maneja cambios en inputs de texto y textarea.
     * Actualiza el estado manteniendo inmutabilidad.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    /**
     * Maneja selección de archivo.
     * - Guarda el archivo en estado
     * - Genera una URL temporal para preview
     */
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(null);
        }
    };


    /**
     * Actualiza la habitación.
     * - Construye FormData para soportar imagen
     * - Llama al servicio
     * - Muestra feedback
     * - Redirige luego de éxito
     */
    const handleUpdate = async () => {
        try {
            const formData = new FormData();

            formData.append('roomType', roomDetails.roomType);
            formData.append('roomPrice', roomDetails.roomPrice);
            formData.append('roomDescription', roomDetails.roomDescription);

            // Se adjunta imagen solo si el usuario seleccionó una nueva
            if (file) {
                formData.append('photo', file);
            }

            const result = await ApiService.updateRoom(roomId, formData);

            if (result.statusCode === 200) {
                setSuccess('Habitación actualizada exitosamente.');

                // Redirección controlada con delay para mejor UX
                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }

            // Limpieza automática del mensaje
            setTimeout(() => setSuccess(''), 5000);

        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };


    /**
     * Elimina la habitación.
     * - Solicita confirmación al usuario
     * - Llama al servicio
     * - Redirige si es exitoso
     */
    const handleDelete = async () => {
        if (window.confirm('¿Quieres eliminar esta habitación?')) {
            try {
                const result = await ApiService.deleteRoom(roomId);

                if (result.statusCode === 200) {
                    setSuccess('Habitación eliminada exitosamente');

                    setTimeout(() => {
                        setSuccess('');
                        navigate('/admin/manage-rooms');
                    }, 3000);
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setTimeout(() => setError(''), 5000);
            }
        }
    };


    /**
     * Render del componente.
     * - Muestra imagen actual o preview
     * - Renderiza formulario controlado
     * - Muestra feedback condicional
     */
    return (
        <div className="edit-room-container">
            <h2>Editar habitación</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="edit-room-form">

                <div className="form-group">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Vista previa de la habitación"
                            className="room-photo-preview"
                        />
                    ) : (
                        roomDetails.roomPhotoUrl && (
                            <img
                                src={roomDetails.roomPhotoUrl}
                                alt="Habitación"
                                className="room-photo"
                            />
                        )
                    )}

                    <input
                        type="file"
                        name="roomPhoto"
                        data-testid="room-photo-input"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="roomType">Tipo de habitación</label>
                    <input
                        id="roomType"
                        type="text"
                        name="roomType"
                        value={roomDetails.roomType}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="roomPrice">Precio de la habitación</label>
                    <input
                        id="roomPrice"
                        type="text"
                        name="roomPrice"
                        value={roomDetails.roomPrice}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Descripción de la habitación</label>
                    <textarea
                        name="roomDescription"
                        value={roomDetails.roomDescription}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <button
                    className="update-button"
                    onClick={handleUpdate}
                >
                    Actualizar habitación
                </button>

                <button
                    className="delete-button"
                    onClick={handleDelete}
                >
                    Eliminar habitación
                </button>

            </div>
        </div>
    );
};

export default EditRoomPage;