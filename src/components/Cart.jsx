import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Cart = ({ cart, onRemoveFromCart, sendOrder, setCart }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para mostrar el Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Estado para el mensaje del Snackbar

  const getTotal = () => {
    return cart.reduce((total, plato) => {

      // Si el plato es "Surtido de Croquetas", se debe usar selectedPrice
      if (plato.nombre === "Surtido de Croquetas") {
        return total + plato.croquetas.precio; // Usa el selectedPrice para el Surtido
      }

      // Si es otro plato, sumar su precio directamente
      return total + plato.precio;
    }, 0).toFixed(2);
  };


  const handleSendOrder = async () => {
    if (typeof sendOrder === 'function') {
      try {
        await sendOrder(cart);
        setSnackbarMessage('Pedido enviado con éxito');
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error al realizar el pedido:', error);
        setSnackbarMessage('Error al realizar el pedido');
        setOpenSnackbar(true);
      }
    } else {
      console.error('sendOrder no es una función');
    }
  };
  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Cierra el Snackbar
  };

  return (
    <Card style={{ padding: '20px', maxWidth: '500px', margin: '20px auto', backgroundColor: '#f9f9f9', borderRadius: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom style={{ color: '#54146c', fontWeight: 'bold', textAlign: 'center' }}>
          Carrito de Compras
        </Typography>
  
        {/* Lista de platos en el carrito */}
        {cart.length === 0 ? (
          <Typography variant="body1" style={{ color: '#888', textAlign: 'center' }}>El carrito está vacío</Typography>
        ) : (
          <List>
            {cart.map((plato) => (
              <ListItem key={plato._id} style={{ marginBottom: '15px', backgroundColor: '#ffffff', borderRadius: '10px', padding: '15px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
                <ListItemText
                  primary={
                    <Typography variant="h6" style={{ color: '#333', fontWeight: 'bold' }}>
                      {plato.nombre}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body1" style={{ color: '#555' }}>
                        Cantidad: {plato.cantidad} {/* Muestra la cantidad */}
                      </Typography>
                      <Typography variant="body2" style={{ color: '#555' }}>
                        Precio: ${plato.precio * plato.cantidad} {/* Precio total por cantidad */}
                      </Typography>
  
                      {/* Ingredientes */}
                      {plato.ingredientes && (
                        <>
                          <Typography variant="body2" style={{ fontWeight: 'bold', color: '#54146c', marginTop: '10px' }}>
                            Ingredientes:
                          </Typography>
                          {plato.ingredientes.map((ingrediente, index) => (
                            <Typography key={index} variant="body2" style={{ color: '#777' }}>
                              - {ingrediente}
                            </Typography>
                          ))}
                        </>
                      )}
  
                      {/* Opciones personalizables */}
                      {plato.opcionesPersonalizables && Object.keys(plato.opcionesPersonalizables).length > 0 && (
                        <>
                          <Typography variant="body2" style={{ fontWeight: 'bold', color: '#54146c', marginTop: '10px' }}>
                            Opciones personalizables:
                          </Typography>
                          {Object.entries(plato.opcionesPersonalizables).map(([opcionTipo, valor], index) => (
                            <Typography key={index} variant="body2" style={{ color: '#777' }}>
                              {opcionTipo}: {valor}
                            </Typography>
                          ))}
                        </>
                      )}
  
                      {/* Punto de cocción */}
                      {plato.puntoCoccion && (
                        <>
                          <Typography variant="body2" style={{ fontWeight: 'bold', color: '#54146c', marginTop: '10px' }}>
                            Punto de cocción:
                          </Typography>
                          <Typography variant="body2" style={{ color: '#777' }}>
                            {plato.puntoCoccion}
                          </Typography>
                        </>
                      )}
  
                      {/* Especificación */}
                      {plato.especificacion && (
                        <>
                          <Typography variant="body2" style={{ fontWeight: 'bold', color: '#54146c', marginTop: '10px' }}>
                            Especificación:
                          </Typography>
                          <Typography variant="body2" style={{ color: '#777' }}>
                            {plato.especificacion}
                          </Typography>
                        </>
                      )}
  
                      {/* Mostrar croquetas seleccionadas */}
                      {plato.croquetas && Object.keys(plato.croquetas).length > 0 && (
                        <>
                          <Typography variant="body2" style={{ fontWeight: 'bold', color: '#54146c', marginTop: '10px' }}>
                            Croquetas seleccionadas:
                          </Typography>
                          {Object.keys(plato.croquetas).map((key, index) => (
                            <Typography key={index} variant="body2" style={{ color: '#777' }}>
                              {key !== "selectedSurtido" && `${plato.croquetas[key]}`}
                            </Typography>
                          ))}
                        </>
                      )}
                    </>
                  }
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => onRemoveFromCart(plato._id)}
                  style={{ color: '#54146c', borderColor: '#54146c', fontWeight: 'bold' }}
                >
                  Eliminar
                </Button>
              </ListItem>
            ))}
          </List>
        )}
  
        {/* Total de la compra */}
        <Divider style={{ margin: '20px 0', backgroundColor: '#e0e0e0' }} />
        <Typography variant="h6" style={{ color: '#333', textAlign: 'center' }}>
          Total: ${getTotal()} {/* Aquí se muestra el total */}
        </Typography>
  
        {/* Botón de enviar pedido */}
        <Button
          onClick={handleSendOrder}
          color="primary"
          disabled={cart.length === 0}
          style={{
            backgroundColor: cart.length === 0 ? '#d3d3d3' : '#54146c',
            color: '#fff',
            fontWeight: 'bold',
            width: '100%',
            marginTop: '20px',
            cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Enviar Pedido
        </Button>
  
        {/* Snackbar de éxito */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

export default Cart;