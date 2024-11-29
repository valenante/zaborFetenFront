import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Plato.css';
import SurtidoCroquetasForm from './SurtidoDeCroquetasForm';
import PlatoOptions from './PlatoOptions';  // Extraemos opciones personalizables a un componente
import { useLocation } from 'react-router-dom';

const PlatoCard = ({ plato, onAddToCart }) => {
  const searchParams = new URLSearchParams(useLocation().search);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredientes, setIngredientes] = useState(plato.ingredientes);
  const [descripcion, setDescripcion] = useState(plato.descripcion);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedPuntosDeCoccion, setSelectedPuntosDeCoccion] = useState('');
  const [selectedEspecificacion, setSelectedEspecificacion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState(1); // Variable para almacenar la cantidad seleccionada
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedCroquetas, setSelectedCroquetas] = useState(null);
  const [tipoPlato, setTipoPlatoState] = useState('tapa');
  const [ingredientesEliminados, setIngredientesEliminados] = useState([]);
  const [selectedTipoServicio, setSelectedTipoServicio] = useState('compartir');
  const alergias = searchParams.get('alergias');
  const comensales = searchParams.get('comensales');
  console.log(plato);


  // Configurar el valor predeterminado según los precios del plato
  useEffect(() => {
    if (plato.precios.tapa !== null) {
      setSelectedSize('tapa');
      setTipoPlatoState('tapa');
    } else if (plato.precios.racion !== null) {
      setSelectedSize('racion');
      setTipoPlatoState('racion');
    } else if (plato.precios.precio !== null) {
      setSelectedSize('precio');
      setTipoPlatoState('plato');
    }
  }, [plato, setTipoPlatoState]);

  const handleSizeChange = (e) => {
    const size = e.target.value;
    setSelectedSize(size);

    if (size === 'precio') {
      setTipoPlatoState('plato');
    } else if (size === 'tapa') {
      setTipoPlatoState('tapa');
    } else if (size === 'racion') {
      setTipoPlatoState('racion');
    }
  };

  const handleAddClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOptionChange = (opcionTipo, value) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [opcionTipo]: value,
    }));
  };

  const handlePuntosDeCoccionChange = (e) => setSelectedPuntosDeCoccion(e.target.value);
  const handleEspecificacionChange = (e) => setSelectedEspecificacion(e.target.value);

  const handleCantidadChange = (e) => {
    let value = e.target.value;

    // Si el valor está vacío, no hacemos nada, lo dejamos vacío temporalmente
    if (value === "") {
      setCantidad(value);
      return;
    }

    // Convertir a número para validarlo
    value = Number(value);

    // Si es NaN (no es un número), lo ignoramos
    if (isNaN(value)) {
      return;
    }

    // Ajustar el valor si está fuera del rango
    if (value < 1) {
      value = 1;
    } else if (value > 10) {
      value = 10;
    }

    // Actualizar el estado con el valor corregido
    setCantidad(value);
  };

  const handleBlur = () => {
    // Si el campo está vacío al perder el foco, lo ponemos en 1
    if (cantidad === "") {

      setCantidad(1);
    }
  };

  const handleTipoServicioChange = (e) => {
    setSelectedTipoServicio(e.target.value);
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
      ingredientesEliminados,
      descripcion,
      size: selectedSize,
      precio: selectedPrice * cantidad, // Multiplicamos el precio por la cantidad
      cantidad, // Agregamos la cantidad al objeto
      opcionesPersonalizables: selectedOptions,
      puntosDeCoccion: selectedPuntosDeCoccion,
      especificacion: selectedEspecificacion,
      croquetas: selectedCroquetas,
      tipo: tipoPlato,
      alergias,
      comensales,
      tipoServicio: selectedTipoServicio,
    };

    console.log(platoParaCarrito.tipo);

    onAddToCart(platoParaCarrito);
    setIsModalOpen(false);
    setSnackbarMessage("Producto agregado correctamente");
    setOpenSnackbar(true);
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    // Agregar el ingrediente eliminado al estado de ingredientesEliminados
    setIngredientesEliminados((prev) => [...prev, ingredientToRemove]);

    // Actualizar el estado de los ingredientes restantes
    setIngredientes(ingredientes.filter((ingrediente) => ingrediente !== ingredientToRemove));
  };


  return (
    <div className="container my-4">
      <div className="row align-items-center custom-container">
        <div className="col-12 col-md-8 mb-3 mb-md-0">
          <h3 className="plato-title">{plato.nombre}</h3>
          <p className="plato-description">{plato.descripcion}</p>
          <Button
            onClick={handleAddClick}
            sx={{
              backgroundColor: '#414f7f',
              color: 'white',
              border: 'none',
              '&:hover': { backgroundColor: '#6c7cb4' }
            }}
            className="order-2 order-md-3"  // Asegura que en pantallas grandes el botón esté debajo
          >
            Agregar al carrito
          </Button>
        </div>
        <div className="col-12 col-md-4 text-center order-1 order-md-2"> {/* Imagen arriba en pantallas pequeñas */}
        <img src={`http://192.168.1.132:3000/${plato.imagen}`} alt={plato.nombre} className="img-fluid rounded-img" />
        <div className="plato-price mt-2">
            {plato.precios.tapa && <div translate="no">Tapa - ${plato.precios.tapa}</div>}
            {plato.precios.racion && <div translate="no">Ración - ${plato.precios.racion}</div>}
            {!plato.precios.tapa && !plato.precios.racion && <div>{plato.precios.precio}€</div>}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} className="plato-modal" sx={{ width: '100%' }}>
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
            handleSizeChange={handleSizeChange}
            handleOptionChange={handleOptionChange}
            selectedEspecificacion={selectedEspecificacion}
            handleEspecificacionChange={handleEspecificacionChange}
            selectedPuntosDeCoccion={selectedPuntosDeCoccion}
            handlePuntosDeCoccionChange={handlePuntosDeCoccionChange}
            setTipoPlato={setTipoPlatoState} // Aquí pasamos el setter local
          />

          {plato.nombre === 'Surtido de Croquetas' && (
            <SurtidoCroquetasForm onUpdateCroquetas={setSelectedCroquetas} plato={plato} />
          )}

          <div className="container">
            <div className="row">
              <div className="col-6">
                <label htmlFor="cantidad">Cantidad:</label>
                <input
                  id="cantidad"
                  type="number"
                  value={cantidad}
                  onChange={handleCantidadChange}
                  onBlur={handleBlur} // Detecta cuando el usuario sale del input
                  min="1"
                  max="10"
                  className="form-control"
                  style={{ width: '100px', marginTop: '10px' }}
                />
              </div>
              <div className="col-6">
                <label htmlFor="servingStyle">Para:</label>
                <select
                  id="servingStyle"
                  value={selectedTipoServicio}
                  onChange={handleTipoServicioChange}
                  className="form-control"
                  style={{ marginTop: '10px' }}
                >
                  <option value="compartir">Compartir</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
            </div>

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

export default PlatoCard;