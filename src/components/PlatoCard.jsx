import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, FormControl } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Plato.css';
import SurtidoCroquetasForm from './SurtidoDeCroquetasForm';
import PlatoOptions from './PlatoOptions';  // Extraemos opciones personalizables a un componente

const PlatoCard = ({ plato, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredientes, setIngredientes] = useState(plato.ingredientes);
  const [descripcion, setDescripcion] = useState(plato.descripcion);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedPuntoCoccion, setSelectedPuntoCoccion] = useState('');
  const [selectedEspecificacion, setSelectedEspecificacion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState(1); // Variable para almacenar la cantidad seleccionada
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedCroquetas, setSelectedCroquetas] = useState(null);

  useEffect(() => {
    if (!plato.precios.tapa && !plato.precios.racion) {
      setPrecio(plato.precios.precio);
      setSelectedSize('precio');
    }
  }, [plato.precios]);

  const handleAddClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOptionChange = (opcionTipo, value) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [opcionTipo]: value,
    }));
  };

  const handlePuntoCoccionChange = (e) => setSelectedPuntoCoccion(e.target.value);
  const handleEspecificacionChange = (e) => setSelectedEspecificacion(e.target.value);

  const handleCantidadChange = (e) => {
    setCantidad(e.target.value);
  };

  const handleAddToCart = () => {
    let selectedPrice = 0;

    if (selectedSize === 'tapa' && plato.precios.tapa) {
      selectedPrice = plato.precios.tapa;
    } else if (selectedSize === 'racion' && plato.precios.racion) {
      selectedPrice = plato.precios.racion;
    } else {
      selectedPrice = plato.precios.precio;
    }

    const platoParaCarrito = {
      ...plato,
      ingredientes,
      descripcion,
      size: selectedSize,
      precio: selectedPrice * cantidad, // Multiplicamos el precio por la cantidad
      cantidad, // Agregamos la cantidad al objeto
      opcionesPersonalizables: selectedOptions,
      puntoCoccion: selectedPuntoCoccion,
      especificacion: selectedEspecificacion,
      croquetas: selectedCroquetas,
    };

    onAddToCart(platoParaCarrito);
    setIsModalOpen(false);
    setSnackbarMessage("Producto agregado correctamente");
    setOpenSnackbar(true);
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    setIngredientes(ingredientes.filter((ingrediente) => ingrediente !== ingredientToRemove));
  };

  const hasTapaOrRacion = plato.precios.tapa || plato.precios.racion;

  return (
    <div className="container my-4">
      <div className="row align-items-center custom-container">
        <div className="col-md-8">
          <h3 className="plato-title">{plato.nombre}</h3>
          <p className="plato-description">{plato.descripcion}</p>
          <Button onClick={handleAddClick} sx={{ backgroundColor: '#414f7f', color: 'white', border: 'none', '&:hover': { backgroundColor: '#6c7cb4' } }}>
            Agregar al carrito
          </Button>
        </div>
        <div className="col-md-4 text-center">
          <img src={plato.imagen} alt={plato.nombre} className="img-fluid rounded-img" />
          <div className="plato-price mt-2">
            {plato.precios.tapa && <div>Tapa - ${plato.precios.tapa}</div>}
            {plato.precios.racion && <div>Ración - ${plato.precios.racion}</div>}
            {!plato.precios.tapa && !plato.precios.racion && <div>{plato.precios.precio}€</div>}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} className="plato-modal">
        <DialogTitle className="plato-modal-title">{plato.nombre}</DialogTitle>
        <DialogContent>
          <div>{plato.descripcion}</div>
          <h4 className="plato-ingredients-title">Ingredientes:</h4>
          <ul className="list-unstyled">
            {ingredientes.map((ingrediente, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center mb-2">
                {ingrediente}
                <Button variant="outline-danger" onClick={() => handleRemoveIngredient(ingrediente)}>
                  Quitar
                </Button>
              </li>
            ))}
          </ul>

          <PlatoOptions
            plato={plato}
            mostrarEspecificaciones={plato.nombre !== 'Surtido de Croquetas'}
            mostrarTamaño={plato.nombre !== 'Surtido de Croquetas'}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedOptions={selectedOptions}
            handleOptionChange={handleOptionChange}
            selectedEspecificacion={selectedEspecificacion}
            handleEspecificacionChange={handleEspecificacionChange}
            selectedPuntoCoccion={selectedPuntoCoccion}
            handlePuntoCoccionChange={handlePuntoCoccionChange}
          />

          {plato.nombre === 'Surtido de Croquetas' && (
            <SurtidoCroquetasForm onUpdateCroquetas={setSelectedCroquetas} plato={plato} />
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

export default PlatoCard;
