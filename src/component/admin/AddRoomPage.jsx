import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

/**
 * AddRoomPage
 * ------------
 * Componente responsable de la creación de nuevas habitaciones en el panel de administración.
 * Gestiona:
 *  - Estado del formulario
 *  - Carga y previsualización de imagen
 *  - Obtención dinámica de tipos de habitación
 *  - Validaciones básicas
 *  - Envío de datos al backend mediante FormData
 */
const AddRoomPage = () => {

    // Hook de navegación para redirección programática tras operación exitosa
    const navigate = useNavigate();

    /**
     * Estado principal del formulario.
     * Centraliza los datos que serán enviados al backend.
     */
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });

    // Archivo seleccionado para la imagen
    const [file, setFile] = useState(null);

    // URL temporal para mostrar vista previa de la imagen seleccionada
    const [preview, setPreview] = useState(null);

    // Mensajes de feedback para el usuario
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Lista de tipos de habitación obtenidos del backend
    const [roomTypes, setRoomTypes] = useState([]);

    // Flag que habilita el input manual cuando se selecciona "nuevo"
    const [newRoomType, setNewRoomType] = useState(false);

    /**
     * useEffect
     * ----------
     * Obtiene los tipos de habitación existentes al montar el componente.
     * Se ejecuta una sola vez gracias al array de dependencias vacío.
     */
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error('Error al obtener los tipos de habitaciones:', error.message);
            }
        };
        fetchRoomTypes();
    }, []);

    /**
     * handleChange
     * -------------
     * Handler genérico para inputs controlados.
     * Actualiza dinámicamente el estado en base al atributo "name".
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    /**
     * handleRoomTypeChange
     * ----------------------
     * Controla la selección del tipo de habitación.
     * Si el usuario selecciona "nuevo", habilita un campo manual.
     */
    const handleRoomTypeChange = (e) => {
        if (e.target.value === 'nuevo') {
            setNewRoomType(true);
            setRoomDetails(prevState => ({ ...prevState, roomType: '' }));
        } else {
            setNewRoomType(false);
            setRoomDetails(prevState => ({ ...prevState, roomType: e.target.value }));
        }
    };

    /**
     * handleFileChange
     * -----------------
     * Gestiona la selección de imagen.
     * Genera una URL temporal para mostrar vista previa sin subir el archivo.
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
     * addRoom
     * --------
     * Ejecuta la lógica principal de creación:
     *  - Validación básica de campos obligatorios
     *  - Confirmación explícita del usuario
     *  - Construcción de FormData para envío multipart
     *  - Manejo de respuesta y redirección
     */
    const addRoom = async () => {

        // Validación mínima de negocio
        if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription) {
            setError('Se deben proporcionar todos los detalles de la habitación.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        // Confirmación antes de ejecutar acción irreversible
        if (!window.confirm('¿Quieres añadir esta habitación?')) {
            return;
        }

        try {
            // Uso de FormData para permitir envío de archivo binario
            const formData = new FormData();
            formData.append('roomType', roomDetails.roomType);
            formData.append('roomPrice', roomDetails.roomPrice);
            formData.append('roomDescription', roomDetails.roomDescription);

            if (file) {
                formData.append('photo', file);
            }

            const result = await ApiService.addRoom(formData);

            // Manejo explícito de respuesta exitosa
            if (result.statusCode === 200) {
                setSuccess('Habitación añadida exitosamente.');
                
                // Redirección diferida para permitir lectura del mensaje
                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }
        } catch (error) {
            // Manejo robusto de error contemplando respuesta HTTP personalizada
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="edit-room-container">
            <h2>Agregar nueva habitación</h2>

            {/* Feedback visual al usuario */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="edit-room-form">

                {/* Sección de carga y preview de imagen */}
                <div className="form-group">
                    {preview && (
                        <img 
                            src={preview} 
                            alt="Vista previa de la habitación" 
                            className="room-photo-preview" 
                        />
                    )}
                    <input
                        type="file"
                        name="roomPhoto"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Selector dinámico de tipo de habitación */}
                <div className="form-group">
                    <label htmlFor="roomType">Tipo de habitación</label>
                    <select 
                        id="roomType" 
                        value={roomDetails.roomType} 
                        onChange={handleRoomTypeChange}
                        onFocus={(e) => (e.target.size = 4)}
                        onBlur={(e) => (e.target.size = 1)}  
                        style={{
                            position: 'relative', 
                            zIndex: 10,
                            display: 'block',
                            marginTop: '10px'
                        }}
                    >
                        <option value="">Seleccione un tipo de habitación</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        <option value="nuevo">Otro (por favor especifique)</option>
                    </select>

                    {/* Input condicional cuando se selecciona tipo personalizado */}
                    {newRoomType && (
                        <input
                            type="text"
                            name="roomType"
                            placeholder="Introduzca un nuevo tipo de habitación"
                            value={roomDetails.roomType}
                            onChange={handleChange}
                        />
                    )}
                </div>

                {/* Campo de precio */}
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

                {/* Campo de descripción */}
                <div className="form-group">
                    <label htmlFor="roomDescription">Descripción de la habitación</label>
                    <textarea
                        id="roomDescription"
                        name="roomDescription"
                        value={roomDetails.roomDescription}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Acción principal */}
                <button 
                    className="update-button" 
                    onClick={addRoom}
                >
                    Añadir habitación
                </button>
            </div>
        </div>
    );
};

export default AddRoomPage;