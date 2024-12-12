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
  const [mesaId, setMesaId] = useState(null); // Nuevo estado para almacenar el id de la mesa
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [ingredientes, setIngredientes] = useState([]);
  // Obtener el número de mesa de la URL
  const mesaFromUrl = searchParams.get('mesa');

  useEffect(() => {
    if (mesaFromUrl) {
      // Realizar la consulta para obtener la mesa por el número
      axios.get(`http://192.168.1.132:3000/api/mesas/numero/${mesaFromUrl}`)
        .then(response => {
          const mesa = response.data;
          if (mesa) {
            setMesaId(mesa.id); // Guardar el id de la mesa en el estado);
            // Actualizar el estado de la mesa a "abierta"
            fetch(`http://192.168.1.132:3000/api/mesas/${mesa.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                estado: 'abierta',
              }),
            }).catch(error => {
              console.error('Error al actualizar el estado de la mesa:', error);
            });
          }
        })
        .catch(error => {
          console.error('Error al obtener la mesa por número:', error);
        });
    }
  }, []);

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

  //Guardar el id de la mesa en el localStorage
  useEffect(() => {
    if (mesaId) {
      localStorage.setItem('mesaId', mesaId);
    }
  }, [mesaId]);

  // Guardar el carrito en localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const categories = [...new Set(platos.map(plato => plato.categoria))];

  const onCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const addToCart = (plato) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart, plato];
      return updatedCart;
    });
  };

  const removeFromCart = (platoId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(plato => plato._id !== platoId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const sendOrder = async () => {
    if (!mesaId) {
      console.error("El ID de la mesa es obligatorio");
      return;
    }
  
    const platos = cart.filter(item => item.tipo === 'plato' || item.tipo === 'tapa' || item.tipo === 'racion');
    const bebidas = cart.filter(item => item.tipo === 'bebida');
  
    const platosParaEnviar = platos.map(plato => ({
      platoId: plato._id,
      nombre: plato.nombre,
      cantidad: plato.cantidad || 1,
      ingredientes,
      ingredientesEliminados: plato.ingredientesEliminados,
      descripcion: plato.descripcion,
      size: plato.size,
      opcionesPersonalizables: plato.opcionesPersonalizables,
      puntosDeCoccion: plato.puntosDeCoccion,
      especificaciones: plato.especificacion,
      precios: plato.precio ? [plato.precio] : [],
      tipo: plato.tipo,
      alergias: plato.alergias,
      comensales: plato.comensales,
      tipoServicio: plato.tipoServicio,
      croquetas: plato.croquetas,
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
  
    const totalPlatos = platosParaEnviar.reduce((acc, plato) => acc + plato.precios[0] * plato.cantidad, 0);
    const totalBebidas = bebidasParaEnviar.reduce((acc, bebida) => acc + bebida.precio * bebida.cantidad, 0);
  
    try {
      // Enviar platos
      if (platosParaEnviar.length > 0) {
        const responsePlatos = await axios.post("http://192.168.1.132:3000/api/pedidos", {
          mesa: mesaId,
          platos: platosParaEnviar,
          total: totalPlatos.toFixed(2),
          comensales: platosParaEnviar[0].comensales,
          alergias: platosParaEnviar[0].alergias,
        });
      }
  
      // Enviar bebidas
      if (bebidasParaEnviar.length > 0) {
        const responseBebidas = await axios.post("http://192.168.1.132:3000/api/pedidoBebidas", {
          mesa: mesaId,
          bebidas: bebidasParaEnviar,
          total: totalBebidas.toFixed(2),
        });

      }
  
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
            <PlatoCard key={plato._id} plato={plato} onAddToCart={addToCart} ingredientes={ingredientes} setIngredientes={setIngredientes} />
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
