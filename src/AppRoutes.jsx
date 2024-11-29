import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import Home from './components/Home';
import BebidasMenu from './components/BebidasMenu';
import PreMenu from './components/PreMenu';

const AppRoutes = () => {
  // Verificamos si la contraseña está en el localStorage
  const isPasswordSet = localStorage.getItem('passwordEntered') === 'true';

  // Función para proteger las rutas
  const ProtectedRoute = ({ element }) => {
    if (!isPasswordSet) {
      return <Navigate to="/preMenu" />; // Redirige si no ha ingresado la contraseña
    }
    return element;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Menu />} />} />
        <Route path="/preMenu" element={<PreMenu />} /> {/* Ruta para ingresar la contraseña */}
        <Route path="/menu" element={<ProtectedRoute element={<Menu />} />} />
        <Route path="/bebidas" element={<ProtectedRoute element={<BebidasMenu />} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
