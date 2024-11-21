import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Badge, IconButton, Box, useMediaQuery, Drawer, Dialog, DialogTitle, DialogContent } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import logo from '../assets/logoZf.webp';
import '../styles/Navbar.css';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';

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
  const numeroMesa = localStorage.getItem('mesa');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const buttonText = location.pathname.includes('bebidas') ? 'Comida' : 'Bebidas';
  const linkTo = location.pathname.includes('bebidas') ? '/menu' : '/bebidas';
  const isSmallScreen = useMediaQuery('(max-width:768px)'); // Correct media query
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Función para traer los pedidos desde la base de datos
  const fetchPedidos = async () => {
    try {
      const response = await fetch(`http://192.168.1.132:3000/api/pedidos/mesa/${numeroMesa}`);
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  useEffect(() => {
    // Función para traer los pedidos desde la base de datos
    const fetchPedidosBebidas = async () => {
      try {
        const response = await fetch(`http://192.168.1.132:3000/api/pedidoBebidas/mesa/${numeroMesa}`);
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      }
    };

    fetchPedidosBebidas();

  }, [numeroMesa]);


  useEffect(() => {
    fetchPedidos(); // Llamada inicial al cargar el componente

    // Establecer un intervalo para actualizar los pedidos cada 5 segundos
    const intervalId = setInterval(fetchPedidos, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [numeroMesa]); // Solo se ejecuta cuando cambia numeroMesa

  const onOrdersClick = () => {
    setOrdersModalOpen(true); // Abre el modal de pedidos
  };

  const closeOrdersModal = () => {
    setOrdersModalOpen(false); // Cierra el modal de pedidos
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    fetchPedidos();
  }, [numeroMesa]);

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
                component={Link}
                to={linkTo} // Cambia la ruta dependiendo de la página actual
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
                <h1>Mis pedidos</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '20px' }}>
                  {pedidos.length > 0 || pedidosBebidas.length > 0 ? (
                    <>
                      {/* Mostrar pedidos de platos */}
                      {pedidos.length > 0 &&
                        pedidos.map((pedido, index) => (
                          <Box key={index} sx={{ marginBottom: '10px', padding: '10px', borderBottom: '2px solid #620375' }}>
                            {pedido.platos && pedido.platos.length > 0 && ( // Verificar que platos existe
                              <div>
                                <strong>Platos:</strong>
                                {pedido.platos.map((plato, idx) => (
                                  <div key={idx} style={{ marginLeft: '10px' }}>
                                    <div>
                                      {plato.nombre} x{plato.cantidad}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </Box>
                        ))}

                      {/* Mostrar pedidos de bebidas */}
                      {pedidosBebidas.length > 0 &&
                        pedidosBebidas.map((pedido, index) => (
                          <Box key={index} sx={{ marginBottom: '10px', padding: '10px', borderBottom: '2px solid #620375' }}>
                            {pedido.bebidas.length > 0 && (
                              <div>
                                <strong>
                                  <span translate="no">Bebidas:</span>
                                </strong>
                                {pedido.bebidas.map((bebida, idx) => (
                                  <div key={idx} style={{ marginLeft: '10px' }}>
                                    <div>
                                      <span translate="no">{bebida.nombre} </span>x{bebida.cantidad}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
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
                component={Link}
                to={linkTo} // Cambia la ruta dependiendo de la página actual
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

            <IconButton onClick={onCartClick}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon sx={{ color: '#620375' }} />
              </Badge>
            </IconButton>

            {/* Aquí mostramos los pedidos en un modal si es pantalla grande */}
            <Dialog open={isOrdersModalOpen} onClose={closeOrdersModal}>
              <DialogTitle>Mis Pedidos</DialogTitle>
              <DialogContent>
                {pedidos.length > 0 ? (
                  pedidos.map((pedido, index) => (
                    <div key={index}>
                      <strong>Pedido {pedido.nombre}</strong>
                      <div><strong>Nombre:</strong> {pedido.nombre}</div>
                      <p>Estado: {pedido.estado}</p>
                      <p>Total: {pedido.total}</p>
                    </div>
                  ))
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
