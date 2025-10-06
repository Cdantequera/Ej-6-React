import React, { useState, useEffect } from 'react'
import './ColorManager.css'

// Componente principal para administrar colores

function ColorManager() {
  // Estados del componente
  const [colorInput, setColorInput] = useState('') // Guarda lo que el usuario escribe en el input
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]) // Guarda los resultados de búsqueda
  const [coloresGuardados, setColoresGuardados] = useState([]) // Lista de colores guardados
  const [colorSeleccionado, setColorSeleccionado] = useState(null) // Color seleccionado actualmente

  // Este efecto se ejecuta cuando el componente se carga por primera vez
  useEffect(() => {
    // Intentamos cargar los colores guardados desde el localStorage
    try {
      const coloresGuardadosLocal = JSON.parse(localStorage.getItem('colors')) || []
      setColoresGuardados(coloresGuardadosLocal)
    } catch (error) {
      // Si hay error, empezamos con array vacío
      console.error('Error cargando colores:', error)
      setColoresGuardados([])
    }
  }, []) 

  // Función para buscar colores - simula una búsqueda en base de datos
  const manejarBusquedaColor = () => {
    // Verificamos que el input no esté vacío
    if (colorInput.trim()) {
      const nombreColor = colorInput.trim().toLowerCase()
      
      // Simulamos que encontramos colores 
      const coloresEncontrados = [
        {
          nombre: nombreColor,
          valor: obtenerValorColor(nombreColor),
          id: Date.now() // Usamos el timestamp como ID único
        }
      ]
      
      // Actualizamos los estados con los resultados
      setResultadosBusqueda(coloresEncontrados)
      setColorSeleccionado(coloresEncontrados[0])
    }
  }

  // Funcion para los colores que tenemos guardados
  const obtenerValorColor = (nombreColor) => {
    // Mapeo de nombres de colores en a sus valores hexadecimales
    const mapaColores = {
      rojo: '#ff0000',
      azul: '#0000ff',
      verde: '#00ff00',
      amarillo: '#ffff00',
      violeta: '#800080',
      naranja: '#ffa500',
      rosa: '#ffc0cb',
      negro: '#000000',
      blanco: '#ffffff',
      gris: '#808080',
      marron: '#a52a2a',
      morado: '#800080',
      celeste: '#87ceeb',
      turquesa: '#40e0d0',
      dorado: '#ffd700',
      plateado: '#c0c0c0'
    }
    
    // Si el color está lomostramos sino por defecto mostraremos
    return mapaColores[nombreColor] || '#cccccc'
  }

  // Función para guardar un color en el localStorage
  const guardarColor = (color) => {
    // Verificamos que el color exista y no esté ya guardado
    if (color && !coloresGuardados.find(c => c.nombre === color.nombre)) {
      // Creamos nuevo array con el color agregado
      const nuevosColores = [...coloresGuardados, color]
      
      // Actualizamos el estado
      setColoresGuardados(nuevosColores)
      
      // Guardamos en localStorage (convertimos a string porque localStorage solo guarda strings)
      localStorage.setItem('colors', JSON.stringify(nuevosColores))
      
      // Limpiamos la búsqueda actual
      setResultadosBusqueda([])
      setColorInput('')
      setColorSeleccionado(null)
    }
  }

  // Función para eliminar un color guardado
  const eliminarColor = (colorId) => {
    // Filtramos el array para quitar el color con el ID especificado
    const nuevosColores = coloresGuardados.filter(color => color.id !== colorId)
    
    // Actualizamos el estado
    setColoresGuardados(nuevosColores)
    
    // Actualizamos el localStorage
    localStorage.setItem('colors', JSON.stringify(nuevosColores))
  }

  // Función para limpiar la búsqueda actual
  const limpiarBusqueda = () => {
    setResultadosBusqueda([])
    setColorSeleccionado(null)
    setColorInput('')
  }

  return (
    <div className="color-manager">
      <h2 className="panel-title">Administrador de Colores</h2>
      
      <div className="search-section">
        <div className="input-group">
          <input
            type="text"
            placeholder="Escribe un color (ej: rojo, azul, verde)"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && manejarBusquedaColor()}
            className="color-input"
          />
          <button onClick={manejarBusquedaColor} className="search-button">
            Buscar Color
          </button>
        </div>

        {/* Mostramos los resultados solo si hay algo en resultadosBusqueda */}
        {resultadosBusqueda.length > 0 && colorSeleccionado && (
          <div className="color-preview">
            <h3>¡Color Encontrado!</h3>
            <div className="color-card">
              {/* Este div muestra el color como un cuadro de color */}
              <div 
                className="color-swatch" 
                style={{ backgroundColor: colorSeleccionado.valor }}
              ></div>
              <div className="color-info">
                <span className="color-name">{colorSeleccionado.nombre}</span>
                <span className="color-value">{colorSeleccionado.valor}</span>
              </div>
              <div className="card-actions">
                <button 
                  onClick={() => guardarColor(colorSeleccionado)}
                  className="save-card-button"
                >
                  Guardar en Lista
                </button>
                <button 
                  onClick={limpiarBusqueda}
                  className="remove-card-button"
                >
                  Descartar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="saved-colors-section">
        <h3>Mis Colores Guardados:</h3>
        <div className="saved-colors-list">
          {/* Mapeamos cada color guardado a un elemento JSX */}
          {coloresGuardados.map((color) => (
            <div key={color.id} className="saved-color-card">
              <div 
                className="color-swatch" 
                style={{ backgroundColor: color.valor }}
              ></div>
              <div className="color-info">
                <span className="color-name">{color.nombre}</span>
                <span className="color-value">{color.valor}</span>
              </div>
              <button 
                onClick={() => eliminarColor(color.id)}
                className="delete-saved-button"
              >
                Quitar
              </button>
            </div>
          ))}
          {/* Mensaje cuando no hay colores guardados */}
          {coloresGuardados.length === 0 && (
            <p className="no-colors">Aún no tienes colores guardados. ¡Busca y guarda algunos!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ColorManager