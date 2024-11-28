// src/components/MenuPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import PlatoCard from './PlatoCard';
import Cart from './Cart';
import { Dialog, DialogContent } from '@mui/material';
import { useLocation } from 'react-router-dom';

const MenuPage = () => {
  const [platos, setPlatos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Obtener el número de mesa de la URL o de localStorage si ya está guardado
  const mesaFromUrl = searchParams.get('mesa');
  const mesa = mesaFromUrl || localStorage.getItem('mesa'); // Si la URL no tiene la mesa, la obtenemos de localStorage

  if (mesa) {
    // Enviar solicitud para cambiar el estado de la mesa a "abierta"
    fetch(`http://192.168.1.132:3000/api/mesas/${mesa}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        estado: 'abierta',
      }),
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error al actualizar el estado de la mesa:', error);
        // Manejar el error si la solicitud falla
      });
  }


  // Guardar el número de mesa en localStorage cuando esté disponible
  useEffect(() => {
    if (mesaFromUrl) {
      localStorage.setItem('mesa', mesaFromUrl); // Guardamos la mesa en localStorage si la obtenemos de la URL
    }
  }, [mesaFromUrl]);

  // Cargar los platos de la API
  useEffect(() => {
    axios.get('http://192.168.1.132:3000/api/platos')
      .then(response => {
        setPlatos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los platos:', error);
      });
  }, []);

  // Cargar el carrito desde localStorage si está disponible
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que se actualice
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart)); // Guardamos el carrito en localStorage
    }
  }, [cart]);

  const categories = [...new Set(platos.map(plato => plato.categoria))];

  const onCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const addToCart = (plato) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart, plato];
      console.log(updatedCart[0].tipo);
      return updatedCart;
    });
  };

  const removeFromCart = (platoId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(plato => plato._id !== platoId);

      // Actualiza el localStorage después de modificar el carrito
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      return updatedCart;
    });
  };


  const sendOrder = async () => {

    // Separar platos y bebidas
    const platos = cart.filter((item) => item.tipo === 'plato' || item.tipo === 'tapa' || item.tipo === 'racion');
    const bebidas = cart.filter(item => item.tipo === 'bebida');

    // Preparar datos para los pedidos
    const platosParaEnviar = platos.map(plato => ({
      platoId: plato._id,
      nombre: plato.nombre,
      cantidad: plato.cantidad || 1,
      ingredientes: plato.ingredientes,
      ingredientesEliminados: plato.ingredientesEliminados,
      descripcion: plato.descripcion,
      size: plato.size,
      opcionesPersonalizables: plato.opcionesPersonalizables,
      puntosDeCoccion: plato.puntosDeCoccion,
      especificaciones: plato.especificacion,
      precios: plato.precio ? [plato.precio] : [],
      tipo: plato.tipo,
    }));

    const bebidasParaEnviar = bebidas.map(bebida => ({
      bebidaId: bebida._id,
      nombre: bebida.nombre,
      cantidad: bebida.cantidad || 1,
      ingredientes: bebida.ingredientes,
      descripcion: bebida.descripcion,
      conHielo: bebida.conHielo,
      acompañante: bebida.acompañante,
      precio: bebida.precio,
      categoria: bebida.categoria,
    }));

    // Calcular totales
    const totalPlatos = platosParaEnviar.reduce((acc, plato) => acc + (plato.precios[0] || 0) * plato.cantidad, 0);
    const totalBebidas = bebidasParaEnviar.reduce((acc, bebida) => acc + bebida.precio * bebida.cantidad, 0);

    if (!mesa) {
      console.error("El campo 'mesa' es obligatorio");
      return;
    }

    try {
      // Crear pedido de platos
      if (platosParaEnviar.length > 0) {
        const responsePlatos = await axios.post("http://192.168.1.132:3000/api/pedidos", {
          mesa,
          platos: platosParaEnviar,
          total: totalPlatos.toFixed(2),
        });

        if (responsePlatos.data && responsePlatos.data.message) {
          console.log('Pedido de platos creado:', responsePlatos.data.message);
        }
      }

      // Crear pedido de bebidas
      if (bebidasParaEnviar.length > 0) {
        const responseBebidas = await axios.post("http://192.168.1.132:3000/api/pedidoBebidas", {
          mesa,
          bebidas: bebidasParaEnviar,
          total: totalBebidas.toFixed(2),
        });

        if (responseBebidas.data && responseBebidas.data.message) {
          console.log('Pedido de bebidas creado:', responseBebidas.data.message);
        }
      }

      // Limpiar carrito y mostrar mensaje
      setSnackbarMessage('Pedido enviado con éxito.');
      setOpenSnackbar(true);
      setCart([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
      setSnackbarMessage('Error al enviar el pedido.');
      setOpenSnackbar(true);
    }
  };


  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  return (
    <div>
      <Navbar
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={categories}
        cartCount={cart.length}
        onCartClick={toggleCartVisibility}
      />

      <div>
        {platos
          .filter(plato =>
            (!selectedCategory || plato.categoria === selectedCategory) && plato.estado === 'habilitado'
          )
          .map(plato => (
            <PlatoCard key={plato._id} plato={plato} onAddToCart={addToCart} />
          ))}
      </div>


      {/* Aquí se muestra el componente Cart con las funciones pasadas como props */}
      {isCartVisible && (
        <Dialog open={isCartVisible} onClose={toggleCartVisibility}>
          <DialogContent>
            <Cart cart={cart} onRemoveFromCart={removeFromCart} sendOrder={sendOrder} setCart={setCart} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MenuPage;
