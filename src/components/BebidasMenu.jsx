import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import BebidaCard from './BebidaCard';
import Cart from './Cart';
import { Dialog, DialogContent, Snackbar } from '@mui/material';
import { useLocation } from 'react-router-dom';

const BebidasMenu = () => {
  const [bebidas, setBebidas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mesa = searchParams.get('mesa');

  // Guardar el número de mesa en localStorage solo si no existe
  useEffect(() => {
    if (mesa && !localStorage.getItem('mesa')) {
      localStorage.setItem('mesa', mesa); // Guardamos la mesa en localStorage
    }
  }, [mesa]);

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Actualizar el carrito en localStorage cada vez que se modifique
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart)); // Guardamos el carrito en localStorage
    }
  }, [cart]);

  useEffect(() => {
    axios.get('http://192.168.1.132:3000/api/bebidas')
      .then(response => {
        setBebidas(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las bebidas:', error);
      });
  }, []);

  const categories = [...new Set(bebidas.map(bebida => bebida.categoria))];

  const onCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const addToCart = (bebida) => {
    setCart([...cart, bebida]); // Agregar bebida al carrito
  };

  const sendOrder = async () => {
    const mesa = localStorage.getItem('mesa');
  
    const productosParaEnviar = cart.map(bebida => ({
      bebidaId: bebida._id,
      nombre: bebida.nombre,
      cantidad: bebida.cantidad || 1,
      descripcion: bebida.descripcion,  // Asegúrate de incluir la descripción
      especificaciones: bebida.especificaciones,
      categoria: bebida.categoria,
      precio: bebida.precio || 0,  // Aquí lo cambiaste a un valor numérico
    }));
  
    console.log(productosParaEnviar);
    
    const total = productosParaEnviar.reduce((acc, bebida) => {
      const precioBebida = bebida.precio || 0;
      return acc + (precioBebida * bebida.cantidad);
    }, 0);
  
    if (!mesa) {
      console.error("El campo 'mesa' es obligatorio");
      return;
    }
  
    const orderData = {
      mesa: mesa,
      bebidas: productosParaEnviar,
      total: total.toFixed(2),
    }  

    try {
      const response = await axios.post("http://192.168.1.132:3000/api/pedidos", orderData);
      if (response.data && response.data.message) {
        setSnackbarMessage(response.data.message);
        setOpenSnackbar(true);
        setCart([]); // Vaciar carrito después de enviar el pedido
      } else {
        setSnackbarMessage('Error al enviar el pedido.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
      setSnackbarMessage('Error al enviar el pedido.');
      setOpenSnackbar(true);
    }
  };
  const removeFromCart = (platoId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(plato => plato._id !== platoId);
      
      // Actualiza el localStorage después de modificar el carrito
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      return updatedCart;
    });
  };
  

  return (
    <div>
      <Navbar
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
                cartCount={cart.length}
        categories={categories}
        onCartClick={toggleCartVisibility}
      />

      <div>
        {bebidas
          .filter(bebida => !selectedCategory || bebida.categoria === selectedCategory)
          .map(bebida => (
            <BebidaCard key={bebida._id} bebida={bebida} onAddToCart={addToCart} mesa={mesa}/>
          ))}
      </div>

      {isCartVisible && (
        <Dialog open={isCartVisible} onClose={toggleCartVisibility}>
          <DialogContent>
            <Cart cart={cart} onRemoveFromCart={removeFromCart} setCart={setCart} sendOrder={sendOrder} />
          </DialogContent>
        </Dialog>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default BebidasMenu;
