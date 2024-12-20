import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Badge, IconButton, Box, useMediaQuery, Drawer, Dialog, DialogContent } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import logo from '../assets/logoZf.webp';
import '../styles/Navbar.css';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = ({
  selectedCategory,
  onCategoryChange,
  categories,
  cartCount,
  onCartClick,
  showCategorySelect = true,
  showCart = true
}) => {
  const [isOrdersModalOpen, setOrdersModalOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [pedidosBebidas, setPedidosBebidas] = useState([]);
  const mesaId = localStorage.getItem('mesaId');  // Obtener el ID de la mesa desde localStorage
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();  // Para acceder a la URL actual
  const navigate = useNavigate();  // Para navegar a otra ruta
  const buttonText = location.pathname.includes('bebidas') ? 'Comida' : 'Bebidas';

  const linkTo = location.pathname.includes('bebidas') ? '/menu' : '/bebidas';


  const handleNavigation = () => {
    // Navegar a la nueva ruta manteniendo los parámetros de la URL
    navigate(`${linkTo}${location.search}`);
  };

  const isSmallScreen = useMediaQuery('(max-width:768px)'); // Correct media query

  // Función para traer los pedidos de comida desde la base de datos
  const fetchPedidos = async () => {
    try {
      const response = await fetch(`http://192.168.1.132:3000/api/pedidos/mesa/${mesaId}`);
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  // Función para traer los pedidos de bebidas desde la base de datos
  const fetchPedidosBebidas = async () => {
    try {
      const response = await fetch(`http://192.168.1.132:3000/api/pedidoBebidas/mesa/${mesaId}`);
      const data = await response.json();
      setPedidosBebidas(data);
    } catch (error) {
      console.error("Error al obtener los pedidos de bebidas:", error);
    }
  };

  useEffect(() => {
    fetchPedidos(); // Llamada inicial al cargar el componente
    fetchPedidosBebidas();

    // Establecer un intervalo para actualizar los pedidos cada 5 segundos
    const intervalId = setInterval(fetchPedidos, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [mesaId]); // Solo se ejecuta cuando cambia numeroMesa

  const onOrdersClick = () => {
    setOrdersModalOpen(true); // Abre el modal de pedidos
  };

  const closeOrdersModal = () => {
    setOrdersModalOpen(false); // Cierra el modal de pedidos
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  
  const onPayClick = () => {
    if (arePedidosComplete()) {
      navigate('/valoracion');
    } else {
      alert('No todos los pedidos están completos. Por favor, revisa tu orden.');
    }
  };

  const arePedidosComplete = () => {
    // Verificar si los pedidos son arrays válidos antes de iterar
    const pedidosArray = Array.isArray(pedidos) ? pedidos : [];
    const pedidosBebidasArray = Array.isArray(pedidosBebidas) ? pedidosBebidas : [];
  
    // Verificar si hay pedidos en comida o bebidas antes de continuar
    if (pedidosArray.length === 0 && pedidosBebidasArray.length === 0) {
      return false;  // No hay pedidos, entonces no están completos
    }
  
    // Verificar si todos los pedidos (comida y bebidas) están completos
    const allCompletos = [...pedidosArray, ...pedidosBebidasArray].every(pedido => {
      // Verificar que el estado del pedido sea 'completado'
      return pedido.estado === 'completado';
    });
  
    return allCompletos;
  };
  
  
  
  useEffect(() => {
    fetchPedidos();
    fetchPedidosBebidas();
  }, [mesaId]);

  return (
    <div className="bg text-black p-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 d-flex justify-content-center gap-3" style={{ borderBottom: '1px solid black', paddingBottom: '30px' }}>
            <img src={logo} alt="Zabor Fetén" />
          </div>
        </div>
      </div>

      <div className="bg text-black p-4">
        <div className="text-center mt-4">
          <a href="https://www.zaborfeten.com/_files/ugd/cad230_31b7df170c4f4d09977d0f091580a43f.pdf" className="custom-link">
            <span className="custom-link-label">Carta de Alergenos</span>
          </a>
        </div>
      </div>

      <div className="container" sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '0 0 10px 10px',
        border: '2px solid #620375',
        opacity: 0.8,
        boxShadow: '0px 4px 7px rgba(0, 0, 0, 0.2)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: '100%', // Ensure full width
        flexDirection: 'row',
        flexWrap: 'wrap',
        transform: 'translateX(0)',
      }}>
        {isSmallScreen ? (
          <>

            <div className='text-center'>
              <IconButton onClick={() => toggleDrawer(true)}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: 'white',
                    color: '#620375',
                    fontWeight: '700',
                    border: '2px solid #620375'
                  }}
                >
                  mis pedidos
                </Button>
              </IconButton>

              <Button
                variant="contained"
                color="primary"
                onClick={handleNavigation}  // Usar el handleNavigation para hacer la navegación
                sx={{
                  margin: 'auto',
                  backgroundColor: 'white',
                  color: '#620375',
                  fontWeight: '700',
                  border: '2px solid #620375',
                }}
              >
                {buttonText}
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/vinos"
                sx={{
                  margin: '10px',
                  backgroundColor: 'white',
                  color: '#620375',
                  fontWeight: '700',
                  border: '2px solid #620375'
                }}
              >
                Vinos
              </Button>

              <Button
                onClick={onPayClick}
                variant="contained"
                disabled={!arePedidosComplete()} // Deshabilitar el botón si los pedidos no están completos
                sx={{
                  backgroundColor: 'white',
                  color: '#620375',
                  fontWeight: '700',
                  border: '2px solid #620375',
                  marginRight: '10px',
                }}
              >
                ¡Valora tus platos!
              </Button>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <IconButton onClick={onCartClick}>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon sx={{ color: '#620375' }} />
                  </Badge>
                </IconButton>
              </div>
              <Select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                displayEmpty
                renderValue={(selected) => (selected ? selected : <em>Selecciona una Categoría</em>)}
                sx={{ minWidth: '200px', marginTop: '20px' }}
              >
                <MenuItem value="">Selecciona una Categoría</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>{category}</MenuItem>
                ))}
              </Select>
              


            </div>
            <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
              <Box sx={{ width: 250, padding: '10px' }} role="presentation">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '20px' }}>
                  {(pedidos.length > 0 || pedidosBebidas.length > 0) ? (
                    <>
                      {/* Mostrar pedidos de platos */}
                      {pedidos.length > 0 && pedidos.some(pedido => pedido.platos?.length > 0) && pedidos.map((pedido, index) => (
                        <Box key={index} sx={{ marginBottom: '10px', padding: '10px', borderBottom: '2px solid #620375' }}>
                          <strong>Platos:</strong>
                          {pedido.platos.map((plato, idx) => (
                            <div key={idx} style={{ marginLeft: '10px' }}>
                              <span>{plato.nombre}</span> x{plato.cantidad}
                            </div>
                          ))}
                        </Box>
                      ))}

                      {/* Mostrar pedidos de bebidas */}
                      {pedidosBebidas.length > 0 && pedidosBebidas.some(pedido => pedido.bebidas?.length > 0) && pedidosBebidas.map((pedido, index) => (
                        <Box key={index} sx={{ marginBottom: '10px', padding: '10px', borderBottom: '2px solid #620375' }}>
                          <strong>Bebidas:</strong>
                          {pedido.bebidas.map((bebida, idx) => (
                            <div key={idx} style={{ marginLeft: '10px' }}>
                              <span>{bebida.nombre}</span> x{bebida.cantidad}
                            </div>
                          ))}
                        </Box>
                      ))}
                    </>
                  ) : (
                    <div>No hay pedidos.</div>
                  )}

                </div>
              </Box>
            </Drawer>


          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                displayEmpty
                renderValue={(selected) => (selected ? selected : <em>Selecciona una Categoría</em>)}
                sx={{ minWidth: '200px' }}
              >
                <MenuItem value="">Selecciona una Categoría</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>{category}</MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNavigation}  // Usar el handleNavigation para hacer la navegación
                sx={{
                  margin: '0 10px',
                  backgroundColor: 'white',
                  color: '#620375',
                  fontWeight: '700',
                  border: '2px solid #620375',
                }}
              >
                {buttonText}
              </Button>
            </div>

            <Button onClick={onOrdersClick} variant="contained" sx={{ backgroundColor: 'white', color: '#620375', fontWeight: '700', border: '2px solid #620375' }}>
              Mis Pedidos
            </Button>

            <Button
                onClick={onPayClick}
                variant="contained"
                disabled={!arePedidosComplete()} // Deshabilitar el botón si los pedidos no están completos
                sx={{
                  backgroundColor: 'white',
                  color: '#620375',
                  fontWeight: '700',
                  border: '2px solid #620375',
                  marginLeft: '10px',
                }}
              >
                ¡Valora tus Platos!
              </Button>

            <IconButton onClick={onCartClick}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon sx={{ color: '#620375' }} />
              </Badge>
            </IconButton>

            {/* Aquí mostramos los pedidos en un modal si es pantalla grande */}
            <Dialog open={isOrdersModalOpen} onClose={closeOrdersModal}>
              <DialogContent>
                {(pedidos.length > 0 || pedidosBebidas.length > 0) ? (
                  <>
                    {/* Mostrar pedidos de platos */}
                    {pedidos.length > 0 && pedidos.some(pedido => pedido.platos?.length > 0) && pedidos.map((pedido, index) => (
                      <Box key={index} sx={{ marginBottom: '10px', padding: '10px', borderBottom: '2px solid #620375' }}>
                        <strong>Platos:</strong>
                        {pedido.platos.map((plato, idx) => (
                          <div key={idx} style={{ marginLeft: '10px' }}>
                            <span>{plato.nombre}</span> x{plato.cantidad}
                          </div>
                        ))}
                      </Box>
                    ))}

                    {/* Mostrar pedidos de bebidas */}
                    {pedidosBebidas.length > 0 && pedidosBebidas.some(pedido => pedido.bebidas?.length > 0) && pedidosBebidas.map((pedido, index) => (
                      <Box key={index} sx={{ marginBottom: '10px', padding: '10px', borderBottom: '2px solid #620375' }}>
                        <strong>Bebidas:</strong>
                        {pedido.bebidas.map((bebida, idx) => (
                          <div key={idx} style={{ marginLeft: '10px' }}>
                            <span>{bebida.nombre}</span> x{bebida.cantidad}
                          </div>
                        ))}
                      </Box>
                    ))}
                  </>
                ) : (
                  <div>No hay pedidos.</div>
                )}
              </DialogContent>
            </Dialog>
          </Box>
        )}
      </div>
    </div>
  );
};

export default Navbar;
