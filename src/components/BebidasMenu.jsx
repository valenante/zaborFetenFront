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
  const [mesaId, setMesaId] = useState(null); // Nuevo estado para almacenar el id de la mesa
  const [mesaEstado, setMesaEstado] = useState('');
  const mesaFromUrl = searchParams.get('mesa');


  const mesa = localStorage.getItem('mesaId'); // Si la URL no tiene la mesa, la obtenemos de localStorage

  useEffect(() => {
    if (mesaFromUrl) {
      // Realizar la consulta para obtener la mesa por el número
      axios.get(`http://192.168.1.132:3000/api/mesas/numero/${mesaFromUrl}`)
        .then(response => {
          const mesa = response.data;
          if (mesa && mesa.id) {
            setMesaId(mesa.id); // Guardar el id de la mesa en el estado
            setMesaEstado(mesa.estado);
          } else {
            console.error('No se encontró una mesa con el número especificado.');
          }
        })
        .catch(error => {
          console.error('Error al obtener la mesa por número:', error);
        });
    }
  }, [mesaFromUrl]);

  //UseEffect para abrir la mesa con su id
  useEffect(() => {
    if (mesa) {
      // Actualizar el estado de la mesa a "abierta"
      fetch(`http://192.168.1.132:3000/api/mesas/${mesa}`, {
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
  }, []);

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
    // Separar platos y bebidas
    const platos = cart.filter(item => item.tipo === 'plato');
    const bebidas = cart.filter(item => item.tipo === 'bebida');

    // Preparar datos para los pedidos
    const platosParaEnviar = platos.map(plato => ({
      platoId: plato._id,
      nombre: plato.nombre,
      cantidad: plato.cantidad || 1,
      ingredientes: plato.ingredientes,
      descripcion: plato.descripcion,
      size: plato.size,
      opcionesPersonalizables: plato.opcionesPersonalizables,
      puntosDeCoccion: plato.puntosDeCoccion,
      especificaciones: plato.especificacion,
      precios: plato.precio ? [plato.precio] : [],
      tipoServicio: plato.tipoServicio,
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
    const totalPlatos = platosParaEnviar.reduce((acc, plato) => acc + plato.precios[0], 0);
    const totalBebidas = bebidasParaEnviar.reduce((acc, bebida) => acc + bebida.precio, 0);

    if (!mesa) {
      console.error("El campo 'mesa' es obligatorio");
      return;
    }

    try {
      if (platosParaEnviar.length > 0) {
        const responsePlatos = await axios.post("http://192.168.1.132:3000/api/pedidos", {
          mesa: mesaId,
          platos: platosParaEnviar,
          total: totalPlatos.toFixed(2),
          comensales: platosParaEnviar[0].comensales,
          alergias: platosParaEnviar[0].alergias,
        });

        if (responsePlatos.data && responsePlatos.data.message) {
          console.log('Pedido de platos creado:', responsePlatos.data.message);
        }
      }


      if (bebidasParaEnviar.length > 0) {
        const responseBebidas = await axios.post("http://192.168.1.132:3000/api/pedidoBebidas", {
          mesa: mesaId,
          bebidas: bebidasParaEnviar,
          total: totalBebidas.toFixed(2),
        });

        if (responseBebidas.data && responseBebidas.data.message) {
            console.log('Pedido de bebidas creado:', responseBebidas.data.message);
        }
    }

      setSnackbarMessage('Pedido enviado con éxito.');
      setOpenSnackbar(true);
      setCart([]);
      localStorage.removeItem('cart');
      window.location.reload();
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
            .filter(bebida =>
              (!selectedCategory || bebida.categoria === selectedCategory) && bebida.estado === 'habilitado'
            )
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
