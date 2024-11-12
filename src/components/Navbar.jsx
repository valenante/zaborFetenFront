import React from 'react';
import { Select, MenuItem, Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import logo from '../assets/logoZf.webp';
import { FaFacebook, FaInstagram, FaGoogle, FaTripadvisor } from 'react-icons/fa';
import '../styles/Navbar.css';
import Button from '@mui/material/Button';

const Navbar = ({
  selectedCategory,
  onCategoryChange,
  categories,
  cartCount,
  onCartClick,
  showCategorySelect = true,
  showCart = true
}) => {
  return (
    <div className="bg text-black p-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-12 d-flex justify-content-center gap-3" style={{ borderBottom: '1px solid black', paddingBottom: '30px' }}>
            <img src={logo} alt="Zabor Fetén" />
          </div>
        </div>
      </div>

      <div className="bg text-black p-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 d-flex justify-content-center">
              <nav className="text-center">
                <Link to="/" className="text-decoration-none text-purple mx-2 large-text">Inicio</Link> |
                <Link to="/menu" className="text-decoration-none text-purple mx-2 large-text">Nuestra Carta</Link> |
                <Link to="/blog" className="text-decoration-none text-purple mx-2 large-text">Blog</Link> |
                <Link to="/encuesta" className="text-decoration-none text-purple mx-2 large-text">Encuesta</Link>
              </nav>
            </div>

            <div className="col-md-6 d-flex flex-row justify-content-center align-items-center gap-4">
              <p className="mb-0 contact-text">
                <a href="mailto:zaborfeten@gmail.com" className="text-decoration-none text-purple">zaborfeten@gmail.com</a>
              </p>
              <p className="mb-0 contact-text">
                <a href="tel:665925413" className="text-decoration-none text-purple">665 92 54 13</a> <br></br>
                <a href="tel:622024285" className="text-decoration-none text-purple">622 024 285</a>
              </p>
              <div className="d-flex gap-3">
                <a href="https://google.com" target="_blank" rel="noopener noreferrer"><FaGoogle color="black" /></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook color="black" /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram color="black" /></a>
                <a href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer"><FaTripadvisor color="black" /></a>
              </div>
            </div>
          </div>
        </div>
        <div className='text-center mt-4'>
          <a
            href="https://www.zaborfeten.com/_files/ugd/cad230_31b7df170c4f4d09977d0f091580a43f.pdf"
            className="custom-link"
          >
            <span className="custom-link-label">Carta de Alergenos</span>
            <div>
        <Button variant="contained" color="primary" component={Link} to="/bebidas">
          Bebidas
        </Button>
      </div>
          </a>
        </div>

      </div>

      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: 'white',
            borderRadius: '0 0 10px 10px',
            opacity: '0.8',
            boxShadow: '0px 4px 7px rgba(0, 0, 0, 0.2)',
            position: 'fixed',  // Fijar al hacer scroll
            top: '0',            // Fijar en la parte superior
            zIndex: '1000'       // Asegura que esté encima de otros elementos
          }}
        >
          {showCategorySelect && (
            <Select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <em>Selecciona una Categoría</em>;
                }
                return selected;
              }}
              style={{ minWidth: '200px' }}
            >
              <MenuItem value="">Selecciona una Categoría</MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>{category}</MenuItem>
              ))}
            </Select>
          )}

          {showCart && (
            <IconButton onClick={onCartClick}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
