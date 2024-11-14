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
    
    // Filtramos y creamos listas separadas para platos y bebidas
    const bebidasParaEnviar = cart
      .filter(item => item.tipo === 'bebida')
      .map(bebida => ({
        bebidaId: bebida._id,
        nombre: bebida.nombre,
        cantidad: bebida.cantidad || 1,
        descripcion: bebida.descripcion,
        especificaciones: bebida.especificaciones,
        categoria: bebida.categoria,
        precio: bebida.precio || 0,
        acompañante: bebida.acompañante,
      }));
  
    const platosParaEnviar = cart
      .filter(item => item.tipo === 'plato')
      .map(plato => ({
        platoId: plato._id,
        nombre: plato.nombre,
        cantidad: plato.cantidad || 1,
        descripcion: plato.descripcion,
        especificaciones: plato.especificaciones,
        categoria: plato.categoria,
        precio: plato.precio || 0,
      }));
    
    console.log("Bebidas para enviar:", bebidasParaEnviar);
    console.log("Platos para enviar:", platosParaEnviar);
  
    const total = cart.reduce((acc, item) => {
      const precioItem = item.precio || 0;
      const cantidad = item.cantidad || 1;  // Establece cantidad como 1 si es undefined
      console.log(`Precio Item: ${precioItem}, Cantidad: ${cantidad}`);
      return acc + (precioItem * cantidad);
    }, 0);
    
    console.log("Total:", total);
    

    if (!mesa) {
      console.error("El campo 'mesa' es obligatorio");
      return;
    }
  
    const orderData = {
      mesa: mesa,
      bebidas: bebidasParaEnviar,
      platos: platosParaEnviar,
      total: total.toFixed(2),
    };
  
    try {
      const response = await axios.post("http://192.168.1.132:3000/api/pedidos", orderData);
      if (response.data && response.data.message) {
        setSnackbarMessage(response.data.message);
        setOpenSnackbar(true);
        setCart([]); // Vaciar carrito después de enviar el pedido
        localStorage.removeItem('cart');  // Limpiar el carrito en localStorage también
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
  
      <div className="container">
        <div className="row">
          {bebidas
            .filter(bebida => !selectedCategory || bebida.categoria === selectedCategory)
            .map(bebida => (
              <div className="col-md-6 mb-4" key={bebida._id}>
                <BebidaCard bebida={bebida} onAddToCart={addToCart} mesa={mesa} />
              </div>
            ))}
        </div>
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
