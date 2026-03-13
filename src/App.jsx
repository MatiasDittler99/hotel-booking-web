import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/common/Navbar';
import FooterComponent from './component/common/Footer';
import LoginPage from './component/auth/LoginPage';
import RegisterPage from './component/auth/RegisterPage';
import HomePage from './component/home/HomePage';
import AllRoomsPage from './component/booking_rooms/AllRoomsPage';
import RoomDetailsBookingPage from './component/booking_rooms/RoomDetailsPage';
import FindBookingPage from './component/booking_rooms/FindBookingPage';
import AdminPage from './component/admin/AdminPage';
import ManageRoomPage from './component/admin/ManageRoomPage';
import EditRoomPage from './component/admin/EditRoomPage';
import AddRoomPage from './component/admin/AddRoomPage';
import ManageBookingsPage from './component/admin/ManageBookingsPage';
import EditBookingPage from './component/admin/EditBookingPage';
import ProfilePage from './component/profile/ProfilePage';
import EditProfilePage from './component/profile/EditProfilePage';
import { ProtectedRoute, AdminRoute } from './service/Guard';

/**
 * App.js
 * - Punto de entrada principal de la aplicación
 * - Configura todas las rutas: públicas, protegidas y de administrador
 * - Incluye Navbar y Footer globales
 */
function App() {
  // Inicializamos estado desde localStorage
  const [loggedIn] = React.useState(() => !!localStorage.getItem("token"));
  const [role] = React.useState(() => localStorage.getItem("role"));
  return (
    <BrowserRouter>
      <div className="App">
        {/* Navbar siempre visible */}
        <Navbar loggedIn={loggedIn} role={role} />
        <div className="content">
          <Routes>

            {/* =========================
                Public Routes
                ========================= */}
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/home" element={<HomePage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/rooms" element={<AllRoomsPage />} />
            <Route path="/find-booking" element={<FindBookingPage />} />

            {/* =========================
                Protected Routes (usuarios autenticados)
                ========================= */}
            <Route path="/room-details-book/:roomId"
              element={<ProtectedRoute element={<RoomDetailsBookingPage />} loggedIn={loggedIn} />}
            />
            <Route path="/profile"
              element={<ProtectedRoute element={<ProfilePage />} loggedIn={loggedIn} />}
            />
            <Route path="/edit-profile"
              element={<ProtectedRoute element={<EditProfilePage />} loggedIn={loggedIn} />}
            />

            {/* =========================
                Admin Routes (requiere rol ADMIN)
                ========================= */}
            <Route path="/admin"
              element={<AdminRoute element={<AdminPage />} loggedIn={loggedIn} role={role} />}
            />
            <Route path="/admin/manage-rooms"
              element={<AdminRoute element={<ManageRoomPage />} loggedIn={loggedIn} role={role} />}
            />
            <Route path="/admin/edit-room/:roomId"
              element={<AdminRoute element={<EditRoomPage />} loggedIn={loggedIn} role={role} />}
            />
            <Route path="/admin/add-room"
              element={<AdminRoute element={<AddRoomPage />} loggedIn={loggedIn} role={role} />}
            />
            <Route path="/admin/manage-bookings"
              element={<AdminRoute element={<ManageBookingsPage />} loggedIn={loggedIn} role={role} />}
            />
            <Route path="/admin/edit-booking/:bookingCode"
              element={<AdminRoute element={<EditBookingPage />} loggedIn={loggedIn} role={role} />}
            />

            {/* =========================
                Fallback Route
                ========================= */}
            {/* Redirige cualquier ruta desconocida a /login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>

        {/* Footer siempre visible */}
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;