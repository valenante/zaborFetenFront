// src/components/MenuPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import PlatoCard from './PlatoCard';
import Cart from './Cart';
import { Dialog, DialogTitle, DialogContent, Snackbar } from '@mui/material';
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
    const productosParaEnviar = cart.map(plato => {
      const basePlato = {
        platoId: plato._id,
        nombre: plato.nombre,
        cantidad: plato.cantidad || 1,  // Aseguramos que la cantidad esté definida
        ingredientes: plato.ingredientes,
        descripcion: plato.descripcion,
        size: plato.size,
        opcionesPersonalizables: plato.opcionesPersonalizables,
        puntosDeCoccion: plato.puntosDeCoccion,
        especificaciones: plato.especificacion,
      };

      if (plato.nombre === "Surtido de Croquetas") {
        // Mapear 'racion' y 'tapa' a valores numéricos si es necesario
        const selectedOptionValue = plato.croquetas.selectedOption === "racion" ? 1 : 0; // Ejemplo de mapeo

        return {
          ...basePlato,
          precios: [plato.croquetas.precio],  // Solo el precio seleccionado para croquetas
          croquetas: {
            selectedOption: selectedOptionValue,  // Convertir 'racion'/'tapa' a número
            selectedPrice: plato.croquetas.selectedPrice,  // Precio de la opción seleccionada
          },
          tipoPorcion: plato.croquetas.tipoPorcion,  // Usar la opción seleccionada como tamaño
          sabor: plato.croquetas.sabor,
        };
      } else {
        return {
          ...basePlato,
          precios: plato.precio ? [plato.precio] : [],  // Usar el precio si está disponible
        };
      }
    });

    // Calcular el total de la orden
    const total = productosParaEnviar.reduce((acc, plato) => {
      const precioPlato = plato.precios[0] || 0;
      return acc + (precioPlato * plato.cantidad);
    }, 0);

    // Verificar que mesa no sea null
    if (!mesa) {
      console.error("El campo 'mesa' es obligatorio");
      return;  // Detener la ejecución si mesa no está definida
    }

    const orderData = {
      mesa: mesa,  // Usamos la variable 'mesa' que ya has obtenido de la URL
      platos: productosParaEnviar,
      total: total.toFixed(2),  // Formateamos el total a 2 decimales
    };

    try {
      // Llamar a la API para enviar el pedido
      const response = await axios.post("http://192.168.1.132:3000/api/pedidos", orderData);
      if (response.data && response.data.message) {
        setSnackbarMessage(response.data.message);  // Mostrar mensaje de éxito
        setOpenSnackbar(true);
        setCart([]);  // Limpiar el carrito
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
          .filter(plato => !selectedCategory || plato.categoria === selectedCategory)
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
