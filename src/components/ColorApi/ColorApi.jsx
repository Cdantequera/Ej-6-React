import React, { useState, useEffect } from 'react'
import './ColorApi.css'

// Componente principal para buscar colores usando una API externa
function ColorApi() {
  // Estados del componente (variables que pueden cambiar y hacen que el componente se actualice)
  const [entradaBusqueda, setEntradaBusqueda] = useState('') // Guarda lo que el usuario escribe en el buscador
  const [datosColor, setDatosColor] = useState(null) // Aquí guardamos la información del color que encontramos
  const [cargando, setCargando] = useState(false) // Indica si estamos esperando respuesta de la API
  const [error, setError] = useState('') // Guarda mensajes de error si algo sale mal
  const [coloresGuardados, setColoresGuardados] = useState([]) // Lista de colores que hemos guardado

  // Este efecto se ejecuta cuando el componente se carga por primera vez
  useEffect(() => {
    // Intentamos cargar los colores guardados desde el localStorage del navegador
    try {
      const coloresGuardadosLocal = JSON.parse(localStorage.getItem('apiColors')) || []
      setColoresGuardados(coloresGuardadosLocal)
    } catch (error) {
      // Si hay algún error (como datos corruptos), empezamos con una lista vacía
      console.error('Error cargando colores de la API:', error)
      setColoresGuardados([])
    }
  }, []) // El array vacío significa que solo se ejecuta una vez al cargar el componente

  // Función para buscar un color en la API externa
  const buscarColor = async () => {
    // Si el campo de búsqueda está vacío, no hacemos nada
    if (!entradaBusqueda.trim()) return

    // Preparamos el estado para una nueva búsqueda
    setCargando(true) // Activamos el estado de "cargando"
    setError('') // Limpiamos cualquier error anterior
    setDatosColor(null) // Limpiamos los datos del color anterior

    try {
      // Limpiamos la entrada del usuario: quitamos el símbolo # si lo puso
      const entradaLimpia = entradaBusqueda.trim().replace('#', '')
      
      // Hacemos la petición a la API usando fetch (esto es como pedir datos a un servidor)
      const respuesta = await fetch(`https://www.thecolorapi.com/id?hex=${entradaLimpia}`)
      
      // Verificamos si la respuesta fue exitosa (código 200)
      if (!respuesta.ok) {
        throw new Error('Color no encontrado en la API')
      }

      // Convertimos la respuesta a formato JSON (JavaScript Object Notation)
      const datos = await respuesta.json()
      
      // Guardamos los datos del color en el estado
      setDatosColor({
        id: Date.now(), // Usamos la fecha actual como ID único
        hex: datos.hex.value, // Código hexadecimal del color
        nombre: datos.name.value, // Nombre del color en inglés
        rgb: datos.rgb.value, // Valor RGB del color
        hsl: datos.hsl.value, // Valor HSL del color
        cmyk: datos.cmyk.value, // Valor CMYK del color
        contraste: datos.contrast.value, // Color de contraste recomendado
        buscado: entradaBusqueda.trim() // Guardamos lo que el usuario buscó originalmente
      })
    } catch (err) {
      // Si algo sale mal, mostramos un mensaje de error al usuario
      setError('Error al buscar el color. Asegúrate de usar un código hexadecimal válido (ej: FF0000 o red)')
      console.error('Error buscando color en la API:', err)
    } finally {
      // Esto se ejecuta siempre, tanto si hay error como si no
      setCargando(false) // Quitamos el estado de "cargando"
    }
  }

  // Función para guardar el color actual en el localStorage
  const guardarColor = () => {
    // Verificamos que haya datos de color y que no esté ya guardado
    if (datosColor && !coloresGuardados.find(color => color.hex === datosColor.hex)) {
      // Creamos un nuevo array con el color actual agregado al final
      const nuevosColoresGuardados = [...coloresGuardados, datosColor]
      
      // Actualizamos el estado con la nueva lista
      setColoresGuardados(nuevosColoresGuardados)
      
      // Guardamos en el localStorage (solo guarda strings, por eso usamos JSON.stringify)
      localStorage.setItem('apiColors', JSON.stringify(nuevosColoresGuardados))
    }
  }

  // Función para eliminar un color guardado
  const eliminarColor = (colorId) => {
    // Filtramos el array para quitar solo el color con el ID que queremos eliminar
    const nuevosColoresGuardados = coloresGuardados.filter(color => color.id !== colorId)
    
    // Actualizamos el estado
    setColoresGuardados(nuevosColoresGuardados)
    
    // Actualizamos el localStorage
    localStorage.setItem('apiColors', JSON.stringify(nuevosColoresGuardados))
  }

  // Función para manejar cuando el usuario presiona una tecla en el input
  const manejarTeclaPresionada = (e) => {
    // Si presiona Enter, hacemos la búsqueda automáticamente
    if (e.key === 'Enter') {
      buscarColor()
    }
  }

  return (
    <div className="color-api">
      <h2 className="panel-title">Buscador de Colores - API</h2>
      
      <div className="search-section">
        <div className="input-group">
          <input
            type="text"
            placeholder="Ingresa un color (hex: FF0000 o nombre en inglés: red)"
            value={entradaBusqueda}
            onChange={(e) => setEntradaBusqueda(e.target.value)}
            onKeyPress={manejarTeclaPresionada}
            className="search-input"
          />
          <button onClick={buscarColor} disabled={cargando} className="search-api-button">
            {cargando ? 'Buscando...' : 'Buscar Color'}
          </button>
        </div>

        {/* Mostramos el mensaje de error si existe */}
        {error && <div className="error-message">{error}</div>}

        {/* Mostramos la tarjeta del color si encontramos datos */}
        {datosColor && (
          <div className="color-card-api">
            <h3>¡Color Encontrado!</h3>
            <div className="color-card-content">
              {/* Este div muestra el color como un cuadro grande */}
              <div 
                className="color-preview-large"
                style={{ backgroundColor: datosColor.hex }}
              ></div>
              
              <div className="color-details">
                <div className="detail-row">
                  <span className="detail-label">Nombre:</span>
                  <span className="detail-value">{datosColor.nombre}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Código Hex:</span>
                  <span className="detail-value">{datosColor.hex}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">RGB:</span>
                  <span className="detail-value">{datosColor.rgb}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">HSL:</span>
                  <span className="detail-value">{datosColor.hsl}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">CMYK:</span>
                  <span className="detail-value">{datosColor.cmyk}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Contraste:</span>
                  <span className="detail-value">{datosColor.contraste}</span>
                </div>
              </div>
            </div>
            
            <div className="card-actions-api">
              <button onClick={guardarColor} className="save-api-button">
                Guardar Color
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="saved-colors-api">
        <h3>Mis Colores Guardados de la API:</h3>
        <div className="saved-colors-grid">
          {/* Mapeamos cada color guardado para crear una tarjeta */}
          {coloresGuardados.map((color) => (
            <div key={color.id} className="saved-color-card-api">
              <div 
                className="color-swatch-api"
                style={{ backgroundColor: color.hex }}
              ></div>
              
              <div className="saved-color-info">
                <h4 className="saved-color-name">{color.nombre}</h4>
                <div className="saved-color-details">
                  <span className="saved-hex">{color.hex}</span>
                  <span className="saved-rgb">{color.rgb}</span>
                </div>
                <div className="saved-color-meta">
                  <span className="search-term">Buscaste: {color.buscado}</span>
                </div>
              </div>
              
              <button 
                onClick={() => eliminarColor(color.id)}
                className="delete-api-button"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
        
        {/* Mensaje cuando no hay colores guardados */}
        {coloresGuardados.length === 0 && (
          <p className="no-colors-api">Aún no has guardado colores de la API. ¡Busca y guarda algunos!</p>
        )}
      </div>
    </div>
  )
}

export default ColorApi