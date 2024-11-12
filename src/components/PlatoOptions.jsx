import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PlatoOptions = ({
  plato,
  selectedSize,
  setSelectedSize,
  selectedOptions,
  handleOptionChange,
  selectedEspecificacion,
  handleEspecificacionChange,
  selectedPuntoCoccion,
  handlePuntoCoccionChange,
  mostrarEspecificaciones,
  mostrarTamaño,
}) => {
      return (
  <>
    {/* Show size options only if the dish is not "Surtido de Croquetas" */}
    {mostrarTamaño && plato.nombre !== 'Surtido de Croquetas' && (plato.precios.tapa || plato.precios.racion || plato.precios.precio) && (
      <FormControl fullWidth margin="normal">
        <InputLabel>Tamaño</InputLabel>
        <Select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          label="Tamaño"
        >
          {plato.precios.tapa && <MenuItem value="tapa">Tapa - ${plato.precios.tapa}</MenuItem>}
          {plato.precios.racion && <MenuItem value="racion">Ración - ${plato.precios.racion}</MenuItem>}
          {!plato.precios.tapa && !plato.precios.racion && plato.precios.precio && (
            <MenuItem value="precio">Precio - ${plato.precios.precio}</MenuItem>
          )}
        </Select>
      </FormControl>
    )}

    {/* Show customizable options only if the dish is not "Surtido de Croquetas" */}
    {plato.nombre !== 'Surtido de Croquetas' && plato.opcionesPersonalizables?.length > 0 && plato.opcionesPersonalizables.map((opcion, index) => (
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

    {/* Show cooking level options only if the dish is not "Surtido de Croquetas" */}
    {plato.nombre !== 'Surtido de Croquetas' && plato.nivelDeCoccion?.length > 0 && (
      <FormControl fullWidth margin="normal">
        <InputLabel>Punto de cocción</InputLabel>
        <Select
          value={selectedPuntoCoccion}
          onChange={handlePuntoCoccionChange}
          label="Punto de cocción"
        >
          {plato.nivelDeCoccion.map((nivel, index) => (
            <MenuItem key={index} value={nivel}>
              {nivel}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}

    {/* Show specifications only if the dish is not "Surtido de Croquetas" */}
    {mostrarEspecificaciones && plato.nombre !== 'Surtido de Croquetas' && plato.especificaciones?.length > 0 && (
      <FormControl fullWidth margin="normal">
        <InputLabel>Especificaciones</InputLabel>
        <Select
          value={selectedEspecificacion}
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
}   

export default PlatoOptions;
