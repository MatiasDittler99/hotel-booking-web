/**
 * RegisterPage Component
 * -----------------------------------------------------------------------------
 * Componente responsable del registro de nuevos usuarios.
 *
 * Responsabilidades:
 * - Gestionar el estado del formulario de registro.
 * - Validar campos obligatorios antes de enviar la solicitud.
 * - Consumir el servicio de registro (ApiService).
 * - Mostrar mensajes de éxito o error.
 * - Redirigir al usuario tras un registro exitoso.
 *
 * Dependencias:
 * - react-router-dom (navegación programática).
 * - ApiService (comunicación con backend).
 */

import React, { useState } from 'react';
import ApiService from '../../service/ApiService';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {

    /**
     * Hook de navegación programática.
     * Permite redirigir al usuario luego del registro exitoso.
     */
    const navigate = useNavigate();

    /**
     * Estado principal del formulario.
     * Se centraliza en un solo objeto para facilitar escalabilidad
     * y mantener consistencia en la actualización de campos.
     */
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    /**
     * Estados para feedback visual al usuario.
     * - errorMessage: mensajes de validación o error del backend.
     * - successMessage: confirmación de registro exitoso.
     */
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    /**
     * Maneja cambios en los inputs del formulario.
     * Utiliza desestructuración y propiedad dinámica
     * para actualizar únicamente el campo modificado.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Validación básica del formulario.
     * Verifica que todos los campos obligatorios estén completos.
     *
     * Retorna:
     * - true si es válido
     * - false si falta algún campo
     */
    const validateForm = () => {
        const { name, email, password, phoneNumber } = formData;

        if (!name || !email || !password || !phoneNumber) {
            return false;
        }

        return true;
    };

    /**
     * Maneja el envío del formulario.
     * Flujo:
     * 1. Previene recarga.
     * 2. Ejecuta validación.
     * 3. Llama al servicio de registro.
     * 4. Maneja respuesta exitosa o error.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación previa al envío
        if (!validateForm()) {
            setErrorMessage('Por favor rellene todos los campos.');

            // Limpia mensaje después de 5 segundos
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        try {
            /**
             * Llamada al backend para registrar usuario.
             */
            const response = await ApiService.registerUser(formData);

            /**
             * Si el registro es exitoso:
             * - Se limpian los campos.
             * - Se muestra mensaje de éxito.
             * - Se redirige tras unos segundos.
             */
            if (response.statusCode === 200) {

                // Reset del formulario
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });

                setSuccessMessage('Usuario registrado exitosamente');

                // Redirección diferida para permitir lectura del mensaje
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/');
                }, 3000);
            }

        } catch (error) {

            /**
             * Manejo de errores:
             * - Prioriza mensaje proveniente del backend.
             * - Fallback a mensaje general del error.
             */
            setErrorMessage(error.response?.data?.message || error.message);

            // Limpia mensaje después de 5 segundos
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    return (
        <div className="auth-container">

            {/* Mensaje de error (renderizado condicional) */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* Mensaje de éxito (renderizado condicional) */}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <h2>Registrarse</h2>

            {/* Formulario de registro */}
            <form onSubmit={handleSubmit}>

                {/* Campo Nombre */}
                <div className="form-group">
                    <label htmlFor="name">Nombre:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Campo Email */}
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Campo Teléfono */}
                <div className="form-group">
                    <label htmlFor="phoneNumber">Número de teléfono:</label>
                    <input
                        id="phoneNumber"
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Campo Password */}
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Botón principal de envío */}
                <button type="submit">Registrarse</button>
            </form>

            {/* Enlace hacia login */}
            <p className="register-link">
                ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
        </div>
    );
}

export default RegisterPage;