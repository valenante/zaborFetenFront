import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, FormControlLabel, Checkbox, Select, MenuItem } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Plato.css';

const BebidaCard = ({ bebida, onAddToCart, mesa }) => {
  const [selectedSize, setSelectedSize] = useState('');  // Para tamaño de bebida, si es necesario
  const [precio, setPrecio] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conHielo, setConHielo] = useState(false);  // Estado para "Con hielo"
  const [refresco, setRefresco] = useState({ refrescoSeleccionado: '', tomarSolo: false }); // Estado combinado
  const [refrescos, setRefrescos] = useState([]);  // Estado para almacenar los refrescos disponibles
  const [cantidad, setCantidad] = useState(1); // Variable para almacenar la cantidad seleccionada

  // Cargar refrescos desde la base de datos
  useEffect(() => {
    const fetchRefrescos = async () => {
      try {
        const response = await fetch('http://192.168.1.132:3000/api/bebidas?categoria=refresco');
        const data = await response.json();
        setRefrescos(data);  // Asumiendo que la respuesta es un arreglo de refrescos
      } catch (error) {
        console.error("Error al obtener refrescos:", error);
      }
    };

    fetchRefrescos();
  }, []);

  useEffect(() => {
    if (bebida.precios) {
      setPrecio(bebida.precios.precio);
      setSelectedSize('precio');
    }
  }, [bebida.precios]);

  const handleAddClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConHieloChange = (event) => {
    setConHielo(event.target.checked);  // Actualiza el estado cuando se cambia la opción "Con hielo"
  };

  const handleRefrescoChange = (event) => {
    setRefresco({ ...refresco, refrescoSeleccionado: event.target.value, tomarSolo: false }); // Actualiza el refresco
  };

  const handleTomarSoloChange = (event) => {
    setRefresco({ ...refresco, tomarSolo: event.target.checked, refrescoSeleccionado: '' }); // Si toma solo, vacía el refresco
  };

  const handleCantidadChange = (e) => {
    setCantidad(e.target.value);
  };


  const handleAddToCart = () => {
    const bebidaParaCarrito = {
      mesa: mesa,
      _id: bebida._id,
      nombre: bebida.nombre,
      precio: bebida.precio,
      descripcion: bebida.descripcion,
      categoria: bebida.categoria,
      especificaciones: bebida.especificaciones || [],
      size: selectedSize,
      ingredientes: bebida.ingredientes || [],
      tipo: 'bebida',
      conHielo: conHielo,
      acompañante: refresco.tomarSolo ? 'Solo' : refresco.refrescoSeleccionado,  // Si toma solo, no asigna refresco
      cantidad,
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
        </div>
        <div className="col-md-4 text-center">
          {bebida.img && (
            <img src={`http://192.168.1.132:3000/${bebida.img}`} alt={bebida.nombre} className="img-fluid rounded-img" />
          )}
          <div className="plato-price mt-2">
            <div>{bebida.precio && `$${bebida.precio.toFixed(2)}`}</div>
          </div>
        </div>

        <div className="col-12 text-center mt-3"> {/* Aseguramos que el botón se alinee correctamente en pantallas pequeñas */}
          <Button
            onClick={handleAddClick}
            sx={{ backgroundColor: '#414f7f', color: 'white', border: 'none', '&:hover': { backgroundColor: '#6c7cb4' } }}
          >
            Agregar al carrito
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} className="plato-modal">
        <DialogTitle className="plato-modal-title">{bebida.nombre}</DialogTitle>
        <DialogContent>
          <div>{bebida.descripcion}</div>

          {/* Selección de refresco o "Tomar solo" */}
          {['ron', 'whisky', 'vodka', 'ginebra', 'licor'].includes(bebida.categoria) && (
            <>
              <FormControlLabel
                control={<Checkbox checked={refresco.tomarSolo} onChange={handleTomarSoloChange} />}
                label="Tomar solo"
              />
              {!refresco.tomarSolo && (
                <Select
                  value={refresco.refrescoSeleccionado}
                  onChange={handleRefrescoChange}
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Selecciona un refresco
                  </MenuItem>
                  {refrescos.map((refresco, index) => (
                    <MenuItem key={index} value={refresco._id}>
                      {refresco.nombre}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </>
          )}
          {/* Input para seleccionar la cantidad */}
          <div className="mt-3">
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              id="cantidad"
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              min="1"
              className="form-control"
              style={{ width: '100px', marginTop: '10px' }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleAddToCart} color="primary">
            Agregar
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
}


export default BebidaCard;
