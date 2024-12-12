import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../styles/Valoracion.css';

const Valoracion = () => {
    const [metodoPago, setMetodoPago] = useState('');
    const [platos, setPlatos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [valoraciones, setValoraciones] = useState({});
    const [comentarios, setComentarios] = useState({});
    const [mesaId, setMesaId] = useState(null);
    const navigate = useNavigate(); 

    const handlePago = (metodo) => {
        setMetodoPago(metodo);
        setModalVisible(true);
    };

    const handleValoracion = (platoId, puntuacion, comentario) => {
        setValoraciones(prev => ({
            ...prev,
            [platoId]: puntuacion
        }));

        setComentarios(prev => ({
            ...prev,
            [platoId]: comentario
        }));
    };

    useEffect(() => {
        const mesaNumero = localStorage.getItem('mesaId');
        setMesaId(mesaNumero);
    }, []);

    useEffect(() => {
        if (mesaId) {
            const obtenerPedidos = async () => {
                try {
                    const response = await axios.get(`http://192.168.1.132:3000/api/pedidos/mesa/${mesaId}`);
                    if (response.data.length > 0) {
                        setPlatos(response.data[0].platos);
                    }
                } catch (error) {
                    console.error('Error al obtener los pedidos:', error);
                }
            };

            obtenerPedidos();
        }
    }, [mesaId]);

    const enviarValoraciones = async () => {
        try {
            const valoracionesData = platos.map(plato => ({
                platoId: plato.platoId,
                puntuacion: valoraciones[plato._id] || 0,
                comentario: comentarios[plato._id] || ''
            }));

            await axios.post(`http://192.168.1.132:3000/api/valoraciones`, { valoraciones: valoracionesData });
            setModalVisible(false);

            toast.success('¡Gracias por tu visita! Esperamos verte pronto.', {
                position: 'bottom-right',
                autoClose: 5000,
            });

            localStorage.removeItem('mesaId');
            localStorage.removeItem('passwordEntered');

            setTimeout(() => {
                navigate('/'); 
            }, 5000);
        } catch (error) {
            console.error('Error al enviar las valoraciones:', error);
            toast.error('Error al enviar las valoraciones', {
                position: 'bottom-right',
                autoClose: 5000,
            });
        }
    };

    // Verificar si todos los platos tienen una puntuación seleccionada
    const isFormValid = platos.every(plato => valoraciones[plato._id] !== undefined);

    return (
        <div className="valoracion-container">
            <div className="valoracion-card">
                <h2 className="titulo">Valoración de los platos</h2>
                {platos.length > 0 ? (
                    platos.map((plato) => (
                        <div key={plato._id} className="plato-item">
                            <h3 className="plato-nombre">{plato.nombre}</h3>
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        className={`star ${valoraciones[plato._id] >= star ? 'selected' : ''}`}
                                        onClick={() => handleValoracion(plato._id, star, comentarios[plato._id])}
                                    >
                                        ☆
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Comentario (opcional)"
                                value={comentarios[plato._id] || ''}
                                onChange={(e) => handleValoracion(plato._id, valoraciones[plato._id], e.target.value)}
                                className="comentario-field"
                            />
                        </div>
                    ))
                ) : (
                    <p className="no-platos">No se encontraron platos en este pedido.</p>
                )}
                <button 
                    onClick={enviarValoraciones} 
                    className="enviar" 
                    disabled={!isFormValid} // Deshabilitar el botón si no se han seleccionado todas las estrellas
                >
                    Enviar Valoraciones
                </button>
            </div>
            <ToastContainer /> 
        </div>
    );
};

export default Valoracion;
