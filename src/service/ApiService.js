import axios from "axios"

/**
 * ApiService
 * Clase central para todas las llamadas a la API.
 * - Maneja usuarios, habitaciones y reservas.
 * - Incluye autenticación, verificación de roles y headers de autorización.
 * 
 * NOTA:
 * - Usa axios para las llamadas HTTP.
 * - Las funciones son estáticas, por lo que no es necesario instanciar la clase.
 */

export default class ApiService {

    // Base URL de la API, configurable mediante variable de entorno
    // static BASE_URL = "https://hotel-booking-api-aoih.onrender.com";
    static BASE_URL = import.meta.env.VITE_API_URL;
    /**
     * getHeader
     * Retorna los headers estándar de autorización para las solicitudes autenticadas.
     * @returns {Object} headers con Authorization Bearer token y Content-Type application/json
     */
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    /** AUTHENTICATION **/

    /** registerUser
     * Registra un nuevo usuario en la API
     * @param {Object} registration - datos de registro del usuario
     * @returns {Object} respuesta de la API
     */
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration)
        return response.data
    }

    /** loginUser
     * Inicia sesión un usuario registrado
     * @param {Object} loginDetails - credenciales (email/password)
     * @returns {Object} respuesta de la API con token
     */
    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails)
        return response.data
    }

    /** USERS **/

    /** getAllUsers
     * Obtiene todos los usuarios (requiere autenticación)
     * @returns {Array} lista de usuarios
     */
    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers: this.getHeader()
        })
        return response.data
    }

    /** getUserProfile
     * Obtiene la información del perfil del usuario logueado
     * @returns {Object} datos del usuario
     */
    static async getUserProfile() {
        const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, {
            headers: this.getHeader()
        })
        return response.data
    }

    /** getUser
     * Obtiene un usuario específico por ID
     * @param {number} userId 
     * @returns {Object} datos del usuario
     */
    static async getUser(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    /** getUserBookings
     * Obtiene todas las reservas de un usuario específico
     * @param {number} userId
     * @returns {Object} usuario con sus reservas
     */
    static async getUserBookings(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    /** deleteUser
     * Elimina un usuario por ID
     * @param {number} userId
     * @returns {Object} respuesta de la API
     */
    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    /** ROOMS **/

    /** addRoom
     * Agrega una nueva habitación a la base de datos
     * - Soporta formData para subir imágenes
     * @param {FormData} formData
     * @returns {Object} respuesta de la API
     */
    static async addRoom(formData) {
        const result = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
            headers: {
                ...this.getHeader(),
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return result.data;
    }

    /** getAllAvailableRooms
     * Obtiene todas las habitaciones disponibles
     * @returns {Array} habitaciones
     */
    static async getAllAvailableRooms() {
        const result = await axios.get(`${this.BASE_URL}/rooms/all-available-rooms`)
        return result.data
    }

    /** getAvailableRoomsByDateAndType
     * Filtra habitaciones por fechas y tipo
     * @param {string} checkInDate
     * @param {string} checkOutDate
     * @param {string} roomType
     * @returns {Array} habitaciones disponibles
     */
    static async getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
        const result = await axios.get(
            `${this.BASE_URL}/rooms/available-rooms-by-date-and-type?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
        )
        return result.data
    }

    /** getRoomTypes
     * Obtiene todos los tipos de habitación
     */
    static async getRoomTypes() {
        const response = await axios.get(`${this.BASE_URL}/rooms/types`)
        return response.data
    }

    /** getAllRooms
     * Obtiene todas las habitaciones
     */
    static async getAllRooms() {
        const result = await axios.get(`${this.BASE_URL}/rooms/all`)
        return result.data
    }

    /** getRoomById
     * Obtiene información de una habitación específica
     * @param {number} roomId
     */
    static async getRoomById(roomId) {
        const result = await axios.get(`${this.BASE_URL}/rooms/room-by-id/${roomId}`)
        return result.data
    }

    /** deleteRoom
     * Elimina una habitación por ID
     * @param {number} roomId
     */
    static async deleteRoom(roomId) {
        const result = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {
            headers: this.getHeader()
        })
        return result.data
    }

    /** updateRoom
     * Actualiza una habitación existente
     * - Soporta formData para imágenes
     * @param {number} roomId
     * @param {FormData} formData
     */
    static async updateRoom(roomId, formData) {
        const result = await axios.put(`${this.BASE_URL}/rooms/update/${roomId}`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return result.data;
    }

    /** BOOKINGS **/

    /** bookRoom
     * Crea una nueva reserva
     * @param {number} roomId
     * @param {number} userId
     * @param {Object} booking
     */
    static async bookRoom(roomId, userId, booking) {
        console.log("USER ID IS: " + userId)
        const response = await axios.post(`${this.BASE_URL}/bookings/book-room/${roomId}/${userId}`, booking, {
            headers: this.getHeader()
        })
        return response.data
    }

    /** getAllBookings
     * Obtiene todas las reservas
     */
    static async getAllBookings() {
        const result = await axios.get(`${this.BASE_URL}/bookings/all`, {
            headers: this.getHeader()
        })
        return result.data
    }

    /** getBookingByConfirmationCode
     * Obtiene una reserva mediante su código de confirmación
     * @param {string} bookingCode
     */
    static async getBookingByConfirmationCode(bookingCode) {
        const result = await axios.get(
            `${this.BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`,
            {
                headers: this.getHeader()
            }
        )
        return result.data
    }

    /** cancelBooking
     * Cancela una reserva por ID
     * @param {number} bookingId
     */
    static async cancelBooking(bookingId) {
        const result = await axios.delete(`${this.BASE_URL}/bookings/cancel/${bookingId}`, {
            headers: this.getHeader()
        })
        return result.data
    }

    /** AUTH CHECKERS **/

    /** logout
     * Elimina token y rol del localStorage
     */
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    /** isAuthenticated
     * Verifica si hay token activo
     */
    static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
    }

    /** isAdmin
     * Verifica si el rol del usuario es ADMIN
     */
    static isAdmin() {
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    /** isUser
     * Verifica si el rol del usuario es USER
     */
    static isUser() {
        const role = localStorage.getItem('role')
        return role === 'USER'
    }
}

