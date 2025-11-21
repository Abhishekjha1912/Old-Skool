import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import BookTable from "./pages/BookTable";

import Dashboard from "./pages/admin/Dashboard";
import AddMenuItem from "./pages/admin/AddMenuItem";
import ManageMenu from "./pages/admin/ManageMenu";
import EditMenuItem from "./pages/admin/EditMenuItem";
import Orders from "./pages/admin/Order";
import Story from "./pages/Story";
import AdminReservations from "./pages/admin/AdminReservations";
import './App.css';
import Contact from "./pages/Contact";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Layout reads location and applies padding only when not on homepage */}
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <Navbar />
      {/* Toast notifications */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <main className={`${isHome ? "min-h-screen" : "pt-16 min-h-screen"}`}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/story" element={<Story />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/book-table" element={<BookTable />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin/menu/edit/:id"
              element={
                <ProtectedRoute role="admin">
                  <EditMenuItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute role="admin">
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reservations"
              element={
                <ProtectedRoute role="admin">
                  <AdminReservations />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />

            {/* Admin-only routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-menu"
              element={
                <ProtectedRoute role="admin">
                  <AddMenuItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-menu"
              element={
                <ProtectedRoute role="admin">
                  <ManageMenu />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
    </>
  );
}

export default App;
