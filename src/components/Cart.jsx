import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Cart = ({ cart, onRemoveFromCart, sendOrder, setCart }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Filtra los items de cart en platos y bebidas
  const platos = cart.filter((item) => item.tipo === 'plato');
  const bebidas = cart.filter((item) => item.tipo === 'bebida');

  const getTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.precio;
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
    setOpenSnackbar(false);
  };

  return (
    <Card style={{ padding: '20px', maxWidth: '500px', margin: '20px auto', backgroundColor: '#f9f9f9', borderRadius: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom style={{ color: '#54146c', fontWeight: 'bold', textAlign: 'center' }}>
          Carrito de Compras
        </Typography>

        {/* Lista de Platos */}
        <Typography variant="h6" style={{ color: '#54146c', fontWeight: 'bold', marginTop: '20px' }}>
          Platos
        </Typography>
        {platos.length === 0 ? (
          <Typography variant="body1" style={{ color: '#888', textAlign: 'center' }}>No hay platos en el carrito</Typography>
        ) : (
          <List>
            {platos.map((plato) => (
              <ListItem key={plato._id} style={{ marginBottom: '15px', backgroundColor: '#ffffff', borderRadius: '10px', padding: '15px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
                <ListItemText
                  primary={<Typography variant="h6" style={{ color: '#333', fontWeight: 'bold' }}>{plato.nombre}</Typography>}
                  secondary={
                    <>
                      <Typography variant="body1" style={{ color: '#555' }}>Cantidad: {plato.cantidad}</Typography>
                      <Typography variant="body2" style={{ color: '#555' }}>Precio: ${plato.precio}</Typography>
                      {/* Muestra ingredientes si existen */}
                      {plato.ingredientes && (
                        <>
                          <Typography variant="body2" style={{ fontWeight: 'bold', color: '#54146c', marginTop: '10px' }}>Ingredientes:</Typography>
                          {plato.ingredientes.map((ingrediente, index) => (
                            <Typography key={index} variant="body2" style={{ color: '#777' }}>- {ingrediente}</Typography>
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

        {/* Lista de Bebidas */}
        <Typography variant="h6" style={{ color: '#54146c', fontWeight: 'bold', marginTop: '20px' }}>
          Bebidas
        </Typography>
        {bebidas.length === 0 ? (
          <Typography variant="body1" style={{ color: '#888', textAlign: 'center' }}>No hay bebidas en el carrito</Typography>
        ) : (
          <List>
            {bebidas.map((bebida) => (
              <ListItem key={bebida._id} style={{ marginBottom: '15px', backgroundColor: '#ffffff', borderRadius: '10px', padding: '15px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
                <ListItemText
                  primary={<Typography variant="h6" style={{ color: '#333', fontWeight: 'bold' }}>{bebida.nombre}</Typography>}
                  secondary={
                    <>
                      <Typography variant="body1" style={{ color: '#555' }}>Cantidad: {bebida.cantidad}</Typography>
                      <Typography variant="body2" style={{ color: '#555' }}>Precio: ${bebida.precio}</Typography>
                      {/* Muestra ingredientes si existen */}
                      {bebida.ingredientes && (
                        <>
                          <Typography variant="body2" style={{ fontWeight: 'bold', color: '#54146c', marginTop: '10px' }}>Ingredientes:</Typography>
                          {bebida.ingredientes.map((ingrediente, index) => (
                            <Typography key={index} variant="body2" style={{ color: '#777' }}>- {ingrediente}</Typography>
                          ))}
                        </>
                      )}
                      <Typography variant="body2" style={{ color: '#555', marginTop: '10px' }}>Acompañante: {bebida.acompañante}</Typography>
                    </>
                  }
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => onRemoveFromCart(bebida._id)}
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
          Total: ${getTotal()}
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
};

export default Cart;
