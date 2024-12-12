import React, { useState, useEffect } from 'react';

const SurtidoDeCroquetasForm = ({ plato, onUpdateCroquetas, onSurtidoComplete }) => {
  const [selectedSurtido, setSelectedSurtido] = useState({}); // Sabores seleccionados y sus cantidades
  const [totalSelected, setTotalSelected] = useState(0); // Total de croquetas seleccionadas

  const maxCroquetas = 6; // Número fijo de croquetas en el surtido
  const precio = plato.precios.precio; // Precio fijo del surtido

  useEffect(() => {
    // Actualizamos las croquetas seleccionadas cuando el surtido cambia
    if (totalSelected === maxCroquetas) {
      // Pasamos un array con los sabores seleccionados y sus cantidades
      const croquetasSeleccionadas = Object.entries(selectedSurtido).flatMap(([sabor, cantidad]) =>
        Array(cantidad).fill(sabor)
      );
      onUpdateCroquetas(croquetasSeleccionadas); // Envía el array de sabores seleccionados al componente padre
    }

    // Enviamos la validación si el surtido está completo
    onSurtidoComplete(totalSelected === maxCroquetas);
  }, [selectedSurtido, totalSelected, onUpdateCroquetas, onSurtidoComplete]);

  const handleSurtidoChange = (sabor, action) => {
    setSelectedSurtido((prevSurtido) => {
      const currentCount = prevSurtido[sabor] || 0;
      let updatedCount = action === 'increment' ? currentCount + 1 : currentCount - 1;

      if (updatedCount < 0) {
        updatedCount = 0; // No permitir valores negativos
      }

      // Solo permitir incrementar si no se supera el máximo de croquetas
      if (updatedCount <= maxCroquetas && (totalSelected + (action === 'increment' ? 1 : -1)) <= maxCroquetas) {
        const newSurtido = { ...prevSurtido, [sabor]: updatedCount };

        if (updatedCount === 0) {
          delete newSurtido[sabor]; // Eliminar sabor si la cantidad es 0
        }

        setTotalSelected(Object.values(newSurtido).reduce((total, count) => total + count, 0));
        return newSurtido;
      }

      return prevSurtido;
    });
  };

  return (
    <div>
      <h4>Selecciona los sabores para las 6 croquetas</h4>

      {plato.saboresDisponibles.map((sabor, index) => (
        <div key={index} className="d-flex align-items-center mb-3">
          <label className="me-3">{sabor}:</label>
          
          <button
            onClick={() => handleSurtidoChange(sabor, 'decrement')}
            disabled={!selectedSurtido[sabor] || selectedSurtido[sabor] === 0}
            className="btn btn-outline-danger btn-sm me-2"
          >
            -
          </button>

          <span className="me-2">{selectedSurtido[sabor] || 0}</span>

          <button
            onClick={() => handleSurtidoChange(sabor, 'increment')}
            disabled={totalSelected >= maxCroquetas}
            className="btn btn-outline-success btn-sm"
          >
            +
          </button>
        </div>
      ))}

      <div className="mt-4">
        <p>Total seleccionadas: {totalSelected} / {maxCroquetas}</p>
        <p>Precio total: {precio} €</p>
      </div>
    </div>
  );
};

export default SurtidoDeCroquetasForm;
