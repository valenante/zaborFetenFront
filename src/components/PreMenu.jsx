import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../styles/PreMenu.css';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

Modal.setAppElement('#root');

const PreMenu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [alergias, setAlergias] = useState('');
  const [comensales, setComensales] = useState(1);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false); // Estado para verificar la contraseña
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mesaId, setMesaId] = useState(null);

  const mesaFromUrl = searchParams.get('mesa');

  // Obtener y guardar el id de la mesa desde la API
  useEffect(() => {
    const savedMesaId = localStorage.getItem('mesaId');
    if (savedMesaId) {
      setMesaId(savedMesaId);
    } else if (mesaFromUrl) {
      axios
        .get(`http://192.168.1.132:3000/api/mesas/numero/${mesaFromUrl}`)
        .then((response) => {
          const mesa = response.data;
          if (mesa && mesa.id) {
            setMesaId(mesa.id);
            localStorage.setItem('mesaId', mesa.id); // Guardar directamente
          }
        })
        .catch((error) => {
          console.error('Error al obtener la mesa por número:', error);
        });
    }
  }, [mesaFromUrl]);

  // Verificar la contraseña
  const handlePasswordConfirm = () => {
    fetch('http://192.168.1.132:3000/api/auth/verifyPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then((response) => {
        if (response.ok) {
          // Guardar en localStorage que la contraseña fue verificada
          localStorage.setItem('passwordEntered', 'true');
          setIsPasswordVerified(true); // Contraseña verificada, habilitar el botón "Confirmar"
        } else {
          response
            .json()
            .then((data) => setError(data.message || 'Contraseña incorrecta'));
        }
      })
      .catch((error) => {
        console.error('Error al verificar la contraseña:', error);
        setError('Error al verificar la contraseña');
      });
  };

  const handleConfirm = () => {
    if (comensales <= 0) {
      setError('El número de comensales debe ser al menos 1');
      return;
    }

    // Actualizar el estado de la mesa a "abierta" si se encuentra el ID
    if (mesaId) {
      axios
        .put(`http://192.168.1.132:3000/api/mesas/${mesaId}`, {
          estado: 'abierta',
        })
        .then(() => {
          // Redirigir al menú con los datos necesarios
          navigate(
            `/menu?mesa=${mesaFromUrl}&alergias=${encodeURIComponent(
              alergias
            )}&comensales=${comensales}`
          );
        })
        .catch((error) => {
          console.error('Error al actualizar el estado de la mesa:', error);
          setError('Error al abrir la mesa');
        });
    } else {
      setError('Mesa no encontrada. Inténtalo de nuevo.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Información inicial"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2 className="modal-title">Información Inicial</h2>
      <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="modal-label">Alergias:</label>
          <input
            type="text"
            className="modal-input"
            value={alergias}
            onChange={(e) => setAlergias(e.target.value)}
            placeholder="Introduce las alergias (opcional)"
          />
        </div>
        <div>
          <label className="modal-label">Número de comensales:</label>
          <input
            type="number"
            className="modal-input"
            value={comensales}
            onChange={(e) => setComensales(parseInt(e.target.value, 10))}
            min="1"
          />
        </div>
        <div>
          <label className="modal-label">Contraseña:</label>
          <input
            type="password"
            className="modal-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduce la contraseña"
          />
        </div>
        {error && <p className="modal-error">{error}</p>}
        <button
          className="modal-button"
          type="button"
          onClick={handlePasswordConfirm}
          disabled={password.trim() === ''} // Deshabilita hasta que se escriba algo en el input de contraseña
        >
          Confirmar Contraseña
        </button>

        {/* Botón de Confirmar que estará habilitado solo si la contraseña fue verificada */}
        <button
          className="modal-button"
          type="button"
          onClick={handleConfirm}
          disabled={!isPasswordVerified} // Deshabilita hasta que se haya verificado la contraseña
        >
          Confirmar
        </button>
      </form>
    </Modal>
  );
};

export default PreMenu;
