import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import BebidasMenu from './components/BebidasMenu';
import PreMenu from './components/PreMenu';
import Valoracion from './components/Valoracion';
import Home from './components/Home';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preMenu" element={<PreMenu />} /> {/* Ruta para ingresar la contraseña */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/bebidas" element={<BebidasMenu />} />
        <Route path="/valoracion" element={<Valoracion />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
