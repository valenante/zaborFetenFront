import React, { useState, useEffect } from 'react';

const PaymentConfirmation = ({ confirmationMessage, setConfirmationMessage }) => {
  useEffect(() => {
    if (confirmationMessage) {
      const timer = setTimeout(() => {
        setConfirmationMessage(''); // Cierra el mensaje después de 4 segundos
      }, 4000);

      return () => clearTimeout(timer); // Limpia el timer cuando se desmonte el componente
    }
  }, [confirmationMessage, setConfirmationMessage]);

  return (
    confirmationMessage && (
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#620375', // Color de fondo morado
          color: 'white',
          borderRadius: '5px',
          position: 'relative',
          animation: 'fadeIn 0.5s ease-in-out', // Animación de aparición
        }}
      >
        <div>{confirmationMessage}</div>
        <button
          onClick={() => setConfirmationMessage('')}
          style={{
            position: 'absolute',
            top: '5px',
            right: '10px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>
    )
  );
};

export default PaymentConfirmation;
