import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // Asegúrate de importar tu componente principal
import Menu from './components/Menu';
import Home from './components/Home';
import BebidasMenu from './components/BebidasMenu';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/menu" element={<Menu />} /> 
        <Route path="/bebidas" element={<BebidasMenu />} /> 
      </Routes>
    </Router>
  );
};

export default AppRoutes;
