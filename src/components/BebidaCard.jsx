import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, FormControlLabel, Checkbox } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Plato.css';

const BebidaCard = ({ bebida, onAddToCart, mesa }) => {
  const [selectedSize, setSelectedSize] = useState('');  // Para tamaño de bebida, si es necesario
  const [precio, setPrecio] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conHielo, setConHielo] = useState(false);  // Estado para "Con hielo"

  useEffect(() => {
    // Si la bebida tiene precios para diferentes tamaños (por ejemplo, vaso pequeño, grande)
    if (bebida.precios) {
      setPrecio(bebida.precios.precio); // Ajusta según la estructura de precios
      setSelectedSize('precio');
    }
  }, [bebida.precios]);

  const handleAddClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConHieloChange = (event) => {
    setConHielo(event.target.checked);  // Actualiza el estado cuando se cambia la opción "Con hielo"
  };

  const handleAddToCart = () => {
    const bebidaParaCarrito = {
      mesa: mesa,
      _id: bebida._id, // Asegúrate de que cada bebida tenga un _id único
      nombre: bebida.nombre,
      precio: bebida.precio,
      descripcion: bebida.descripcion,
      categoria: bebida.categoria,
      especificaciones: bebida.especificaciones || [], // Solo si existen especificaciones
      size: selectedSize,
      ingredientes: bebida.ingredientes || [], // Solo si existen ingredientes
      tipo: 'bebida', // Agrega un campo tipo para identificar que es una bebida
      conHielo: conHielo,  // Añadir la opción "Con hielo"
    };
  
    console.log(bebidaParaCarrito);
    onAddToCart(bebidaParaCarrito);
    setIsModalOpen(false);
    setSnackbarMessage("Bebida agregada correctamente");
    setOpenSnackbar(true);
  };

  return (
    <div className="container my-4">
      <div className="row align-items-center custom-container">
        <div className="col-md-8">
          <h3 className="plato-title">{bebida.nombre}</h3>
          <p className="plato-description">{bebida.descripcion}</p>
          <Button onClick={handleAddClick} sx={{ backgroundColor: '#414f7f', color: 'white', border: 'none', '&:hover': { backgroundColor: '#6c7cb4' } }}>
            Agregar al carrito
          </Button>
        </div>
        <div className="col-md-4 text-center">
          <img src={bebida.imagen} alt={bebida.nombre} className="img-fluid rounded-img" />
          <div className="plato-price mt-2">
            <div>{bebida.precio && `$${bebida.precio}`}</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} className="plato-modal">
        <DialogTitle className="plato-modal-title">{bebida.nombre}</DialogTitle>
        <DialogContent>
          <div>{bebida.descripcion}</div>
          
          {/* Opción "Con hielo" */}
          <FormControlLabel
            control={<Checkbox checked={conHielo} onChange={handleConHieloChange} />}
            label="Con hielo"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleAddToCart} color="primary">
            Agregar al carrito
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        sx={{
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '5px',
          padding: '10px',
          fontSize: '16px',
        }}
      />
    </div>
  );
};

export default BebidaCard;
