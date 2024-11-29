import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Instala react-modal si no lo tienes
import '../styles/PreMenu.css'; // Asegúrate de importar tus estilos
import { useSearchParams } from 'react-router-dom'; // Importa useSearchParams
Modal.setAppElement('#root'); // Asegúrate de que esto apunte al ID correcto en tu index.html

const PreMenu = () => {
  const [isOpen, setIsOpen] = useState(true); // Modal abierto por defecto
  const [alergias, setAlergias] = useState('');
  const [comensales, setComensales] = useState(1); // Valor mínimo
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Usamos useSearchParams

  const mesa = searchParams.get('mesa'); // Aquí obtenemos el valor de 'mesa' desde la query string


  const handleConfirm = () => {
    if (comensales <= 0) {
      setError('El número de comensales debe ser al menos 1');
      return;
    }

    fetch('http://192.168.1.132:3000/api/auth/verifyPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    .then((response) => {
      if (response.ok) {
        // Si la contraseña es correcta, almacenamos un valor en el localStorage
        localStorage.setItem('passwordEntered', 'true');
        // Asegúrate de que 'mesa' esté disponible en el componente o que se pase como parámetro
        navigate(`/menu?mesa=${mesa}&alergias=${encodeURIComponent(alergias)}&comensales=${comensales}`);
      } else {
        // Si la contraseña es incorrecta
        response.json().then(data => setError(data.message || 'Contraseña incorrecta'));
      }
    })
    .catch((error) => {
      console.error('Error al verificar la contraseña:', error);
      setError('Error al verificar la contraseña');
    });
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
    <button className="modal-button" onClick={handleConfirm}>
      Confirmar
    </button>
  </form>
</Modal>

  );
};

export default PreMenu;
