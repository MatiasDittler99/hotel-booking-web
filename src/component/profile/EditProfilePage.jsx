import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditProfilePage = () => {
    // 🔹 Estado para almacenar la información del usuario
    const [user, setUser] = useState(null);
    // 🔹 Estado para manejar errores en la UI
    const [error, setError] = useState(null);
    // 🔹 Hook de react-router-dom para redirecciones programáticas
    const navigate = useNavigate();

    // 🔹 useEffect para cargar los datos del usuario al montar el componente
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile(); // Llama al API
                setUser(response.user); // Almacena el usuario en el estado
            } catch (error) {
                setError(error.message); // Muestra error si falla la petición
            }
        };

        fetchUserProfile();
    }, []);

    // 🔹 Función que maneja la eliminación de perfil
    const handleDeleteProfile = async () => {
        // Confirmación antes de eliminar
        if (!window.confirm('¿Estás seguro de que quieres eliminar tu cuenta?')) {
            return; // Si el usuario cancela, no hace nada
        }
        try {
            await ApiService.deleteUser(user.id); // Llama al API para eliminar
            navigate('/signup'); // Redirige al registro tras eliminar
        } catch (error) {
            setError(error.message); // Muestra error si falla la operación
        }
    };

    return (
        <div className="edit-profile-page">
            {/* 🔹 Título de la página */}
            <h2>Editar perfil</h2>

            {/* 🔹 Mensaje de error */}
            {error && <p className="error-message">{error}</p>}

            {/* 🔹 Detalles del perfil solo si existe un usuario */}
            {user && (
                <div className="profile-details">
                    <p><strong>Nombre:</strong> {user.name}</p>
                    <p><strong>Correo electrónico:</strong> {user.email}</p>
                    <p><strong>Número de teléfono:</strong> {user.phoneNumber}</p>

                    {/* 🔹 Botón para eliminar el perfil */}
                    <button
                        className="delete-profile-button"
                        onClick={handleDeleteProfile}
                    >
                        Eliminar perfil
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditProfilePage;