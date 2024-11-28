import React, { useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PlatoOptions = ({
  plato,
  selectedSize,
  setSelectedSize,
  selectedOptions,
  handleOptionChange,
  selectedEspecificacion,
  handleEspecificacionChange,
  selectedPuntosDeCoccion,
  handlePuntosDeCoccionChange,
  mostrarEspecificaciones,
  mostrarTamaño,
  setTipoPlato
}) => {
  // Configurar valores predeterminados
  useEffect(() => {
    // Valor predeterminado para el tamaño
    if (mostrarTamaño && !selectedSize) {
      if (plato.precios.precio !== null) setSelectedSize('precio');
      else if (plato.precios.tapa !== null) setSelectedSize('tapa');
      else if (plato.precios.racion !== null) setSelectedSize('racion');
    }

    // Valor predeterminado para puntos de cocción
    if (plato.puntosDeCoccion?.length > 0 && !selectedPuntosDeCoccion) {
      handlePuntosDeCoccionChange({ target: { value: plato.puntosDeCoccion[0] } });
    }

    // Valor predeterminado para especificaciones
    if (mostrarEspecificaciones && plato.especificaciones?.length > 0 && !selectedEspecificacion) {
      handleEspecificacionChange({ target: { value: plato.especificaciones[0] } });
    }

    // Valores predeterminados para opciones personalizables
    plato.opcionesPersonalizables?.forEach((opcion) => {
      if (!selectedOptions[opcion.tipo] && opcion.opciones.length > 0) {
        handleOptionChange(opcion.tipo, opcion.opciones[0]);
      }
    });
  }, [
    plato,
    selectedSize,
    selectedOptions,
    selectedPuntosDeCoccion,
    selectedEspecificacion,
    mostrarTamaño,
    mostrarEspecificaciones,
    setSelectedSize,
    handleOptionChange,
    handleEspecificacionChange,
    handlePuntosDeCoccionChange
  ]);

  const handleSizeChange = (e) => {
    const size = e.target.value;
    setSelectedSize(size);

    // Actualizar el tipo del plato según la opción seleccionada
    if (size === 'precio') {
      setTipoPlato('plato');
    } else if (size === 'tapa') {
      setTipoPlato('tapa');
    } else if (size === 'racion') {
      setTipoPlato('racion');
    }
  };

  return (
    <>
      {/* Mostrar opciones de tamaño */}
      {mostrarTamaño &&
        plato.nombre !== 'Surtido de Croquetas' &&
        (plato.precios.tapa || plato.precios.racion || plato.precios.precio) && (
          <FormControl fullWidth margin="normal">
            <Select value={selectedSize} onChange={handleSizeChange} label="Seleccione tamaño">
              {plato.precios.precio !== null && (
                <MenuItem value="precio">Precio - ${plato.precios.precio}</MenuItem>
              )}
              {plato.precios.tapa !== null && (
                <MenuItem value="tapa">Tapa - ${plato.precios.tapa}</MenuItem>
              )}
              {plato.precios.racion !== null && (
                <MenuItem value="racion">Ración - ${plato.precios.racion}</MenuItem>
              )}
            </Select>
          </FormControl>
        )}

      {/* Opciones personalizables */}
      {plato.nombre !== 'Surtido de Croquetas' &&
        plato.opcionesPersonalizables?.map((opcion, index) => (
          <FormControl fullWidth margin="normal" key={index}>
            <InputLabel>{opcion.nombre}</InputLabel>
            <Select
              value={selectedOptions[opcion.tipo] || ''}
              onChange={(e) => handleOptionChange(opcion.tipo, e.target.value)}
              label={opcion.nombre}
            >
              {opcion.opciones.map((opcionValue, i) => (
                <MenuItem key={i} value={opcionValue}>
                  {opcionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

      {/* Puntos de cocción */}
      {plato.nombre !== 'Surtido de Croquetas' &&
        plato.puntosDeCoccion?.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Punto de cocción</InputLabel>
            <Select
              value={selectedPuntosDeCoccion || ''}
              onChange={handlePuntosDeCoccionChange}
              label="Punto de cocción"
            >
              {plato.puntosDeCoccion.map((nivel, index) => (
                <MenuItem key={index} value={nivel}>
                  {nivel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

      {/* Especificaciones */}
      {mostrarEspecificaciones &&
        plato.nombre !== 'Surtido de Croquetas' &&
        plato.especificaciones?.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Especificaciones</InputLabel>
            <Select
              value={selectedEspecificacion || ''}
              onChange={handleEspecificacionChange}
              label="Especificaciones"
            >
              {plato.especificaciones.map((especificacion, index) => (
                <MenuItem key={index} value={especificacion}>
                  {especificacion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
    </>
  );
};

export default PlatoOptions;
