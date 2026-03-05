/**
 * LoginPage Component
 * -----------------------------------------------------------------------------
 * Componente responsable de la autenticación de usuarios.
 *
 * Responsabilidades:
 * - Gestionar el estado del formulario (email y contraseña).
 * - Validar campos obligatorios.
 * - Consumir el servicio de login.
 * - Persistir credenciales (token y rol) en localStorage.
 * - Redirigir al usuario a la ruta previamente solicitada.
 *
 * Dependencias:
 * - react-router-dom (navegación y redirección condicional).
 * - ApiService (comunicación con backend).
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";

function LoginPage() {

    /**
     * Estados locales del formulario.
     * - email: almacena el valor del input de correo.
     * - password: almacena la contraseña ingresada.
     * - error: mensaje de error temporal mostrado al usuario.
     */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    /**
     * Hook para navegación programática.
     */
    const navigate = useNavigate();

    /**
     * Hook para acceder a la ubicación actual.
     * Permite redirigir al usuario a la ruta original
     * si fue enviado al login desde una ruta protegida.
     */
    const location = useLocation();

    /**
     * Determina la ruta de retorno luego del login exitoso.
     * Si existe estado previo (protected route), redirige allí.
     * Caso contrario, redirige a "/home".
     */
    const from = location.state?.from?.pathname || '/home';


    /**
     * Maneja el envío del formulario.
     * Flujo:
     * 1. Previene recarga del formulario.
     * 2. Valida campos obligatorios.
     * 3. Llama al servicio de autenticación.
     * 4. Guarda credenciales.
     * 5. Redirige al usuario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica de campos vacíos
        if (!email || !password) {
            setError('Por favor, rellene todos los campos.');
            
            // Limpia el mensaje luego de 5 segundos
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            /**
             * Llamada al backend para autenticar usuario.
             */
            const response = await ApiService.loginUser({ email, password });

            /**
             * Si la autenticación es exitosa:
             * - Se almacenan token y rol en localStorage.
             * - Se redirige reemplazando el historial.
             */
            if (response.statusCode === 200) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);

                navigate(from, { replace: true });
            }

        } catch (error) {
            /**
             * Manejo de errores:
             * - Se prioriza mensaje proveniente del backend.
             * - Fallback al mensaje general del error.
             */
            setError(error.response?.data?.message || error.message);

            // Limpia el mensaje luego de 5 segundos
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="auth-container">
            <h2>Iniciar sesión</h2>

            {/* Renderizado condicional del mensaje de error */}
            {error && <p className="error-message">{error}</p>}

            {/* Formulario de autenticación */}
            <form onSubmit={handleSubmit}>

                {/* Campo Email */}
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico: </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Campo Password */}
                <div className="form-group">
                    <label htmlFor="password">Contraseña: </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Botón de envío */}
                <button type="submit">Iniciar sesión</button>
            </form>

            {/* Enlace hacia la vista de registro */}
            <p className="register-link">
                ¿No tienes una cuenta? <a href="/register">Registrate aquí</a>
            </p>
        </div>
    );
}

export default LoginPage;