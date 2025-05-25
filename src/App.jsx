import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./components/home/Home";
import ExistingRooms from "./components/room/ExistingRooms";
import EditRoom from "./components/room/EditRoom";
import AddRoom from "./components/room/AddRoom";
import RoomListing from "./components/room/RoomListing";
import Admin from "./components/admin/Admin";
import Checkout from "./components/booking/Checkout";
import BookingSuccess from "./components/booking/BookingSuccess";
import Bookings from "./components/booking/Bookings";
import FindBooking from "./components/booking/FindBooking";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Profile from "./components/auth/Profile";
import VerifyEmailNotice from "./components/auth/VerifyEmailNotice";
import ChangePassword from "./components/auth/ChangePassword";

import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";

import { AuthProvider } from "./components/auth/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
import AppInitializer from "./components/auth/AppInitializer";
import AdminLayout from "./components/admin/AdminLayout";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <main>
      {!isAdminRoute && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit-room/:roomId" element={<EditRoom />} />
        <Route path="/add-room" element={<AddRoom />} />
        <Route path="/book-room/:roomId" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="/browse-all-rooms" element={<RoomListing />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/find-booking" element={<FindBooking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify-email" element={<VerifyEmailNotice />} />
        <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
        <Route path="/logout" element={<FindBooking />} />
        <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
        <Route path="/admin/existing-rooms" element={<AdminLayout><ExistingRooms /></AdminLayout>} />
        <Route path="/admin/existing-bookings" element={<AdminLayout><Bookings /></AdminLayout>} />
        <Route path="/admin/add-room" element={<AdminLayout><AddRoom /></AdminLayout>} />
        <Route path="/admin/edit-room/:roomId" element={<AdminLayout><EditRoom /></AdminLayout>} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </main>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer />
      <AuthProvider>
        <AppInitializer />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
