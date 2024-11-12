import React, { useState, useEffect } from 'react';

const SurtidoDeCroquetasForm = ({ plato, onUpdateCroquetas }) => {
  const [tipoPorcion, settipoPorcion] = useState('');  // Tapa, Ración o Surtido
  const [sabor, setsabor] = useState(''); // Sabor seleccionado cuando es tapa o ración
  const [totalSelected, setTotalSelected] = useState(0); // Número total de croquetas seleccionadas en el surtido
  const [precio, setprecio] = useState(plato.precios.precio); // Precio base

  useEffect(() => {
    // Actualizar las croquetas según el tipo de porción y selección de sabores
    if (tipoPorcion === 'surtido' && totalSelected === 6) {
      onUpdateCroquetas({ tipoPorcion, precio, sabor });
    } else if (tipoPorcion !== 'surtido') {
      onUpdateCroquetas({ tipoPorcion, precio, sabor });
    }
  }, [
    tipoPorcion,
    sabor,
    precio,
    totalSelected,
    onUpdateCroquetas
  ]);

  // Maneja el cambio en la selección de sabores para el surtido
  const handleSurtidoChange = (sabor, action) => {
    setsabor((prevSurtido) => {
      const updatedCount = action === 'increment' ? (prevSurtido[sabor] || 0) + 1 : (prevSurtido[sabor] || 0) - 1;
      const newSurtido = { ...prevSurtido, [sabor]: Math.max(updatedCount, 0) };
      setTotalSelected(Object.values(newSurtido).reduce((total, count) => total + count, 0));
      return newSurtido;
    });
  };

  // Maneja el cambio en la selección de tapa o ración
  const handleOptionChange = (e) => {
    settipoPorcion(e.target.value);
    // Actualizar el precio según la opción seleccionada
    if (e.target.value === 'tapa') {
      setprecio(plato.precios.tapa);
      setsabor(''); // Reiniciar sabor para tapa o ración
    } else if (e.target.value === 'racion') {
      setprecio(plato.precios.racion);
      setsabor(''); // Reiniciar sabor para tapa o ración
    } else if (e.target.value === 'surtido') {
      setprecio(plato.precios.surtido);
      setsabor({}); // Reiniciar surtido para surtido
      setTotalSelected(0);
    }
  };

  // Maneja el cambio de sabor en tapa o ración
  const handleSingleSaborChange = (e) => {
    setsabor(e.target.value);
  };

  return (
    <div>
      <h4>Selecciona la opción del Surtido de Croquetas</h4>

      {/* Opciones: Tapa, Ración o Surtido */}
      <div>
        <label>
          <input
            type="radio"
            value="tapa"
            checked={tipoPorcion === 'tapa'}
            onChange={handleOptionChange}
          />
          Tapa
        </label>
        <label>
          <input
            type="radio"
            value="racion"
            checked={tipoPorcion === 'racion'}
            onChange={handleOptionChange}
          />
          Ración
        </label>
        <label>
          <input
            type="radio"
            value="surtido"
            checked={tipoPorcion === 'surtido'}
            onChange={handleOptionChange}
          />
          Surtido
        </label>
      </div>

      {/* Selección de sabor para Tapa o Ración */}
      {tipoPorcion === 'tapa' || tipoPorcion === 'racion' ? (
        <div>
          <h5>Selecciona un sabor</h5>
          <select value={sabor} onChange={handleSingleSaborChange}>
            <option value="">Selecciona un sabor</option>
            {plato.ingredientes.map((saborItem, index) => (
              <option key={index} value={saborItem}>
                {saborItem}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {/* Selección de sabores para Surtido */}
      {tipoPorcion === 'surtido' && (
        <div>
          <h5>Selecciona los sabores para las 6 croquetas</h5>
          {plato.ingredientes.map((saborItem, index) => (
            <div key={index}>
              <label>{saborItem}:</label>
              <div>
                <button
                  onClick={() => handleSurtidoChange(saborItem, 'decrement')}
                  disabled={sabor[saborItem] === 0}
                >
                  -
                </button>
                <span>{sabor[saborItem] || 0}</span>
                <button
                  onClick={() => handleSurtidoChange(saborItem, 'increment')}
                  disabled={totalSelected === 6}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mostrar el precio según la opción seleccionada */}
      <div>
        <p>Precio seleccionado: {precio} €</p>
      </div>

      {/* Validación: asegurarse de que haya 6 croquetas seleccionadas en el surtido */}
      <div>
        {tipoPorcion !== 'surtido' || totalSelected === 6 ? (
          <button onClick={() => onUpdateCroquetas({ tipoPorcion, sabor, precio })}>
            Confirmar Selección
          </button>
        ) : (
          <p>Debes seleccionar 6 croquetas en total.</p>
        )}
      </div>
    </div>
  );
};

export default SurtidoDeCroquetasForm;
