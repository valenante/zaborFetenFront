import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRoutes'; // Asegúrate de importar tu archivo de rutas
import './index.css'; // Si tienes un archivo de estilos
import Footer from './components/Footer'; // Asegúrate de importar el componente Footer

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRoutes /> {/* Renderiza las rutas aquí */}
    <Footer /> {/* Renderiza el componente Footer */}
  </React.StrictMode>
);
