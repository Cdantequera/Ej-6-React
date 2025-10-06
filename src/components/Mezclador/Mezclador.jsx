import React, { useState, useEffect } from "react";
import "./Mezclador.css";

// Componente principal para mezclar dos colores y crear nuevos colores

function Mezclador() {

    // Estados del componente
    const [color1, setColor1] = useState("#ff0000"); // Primer color a mezclar (rojo por defecto)
    const [color2, setColor2] = useState("#0000ff"); // Segundo color a mezclar (azul por defecto)
    const [colorMezclado, setColorMezclado] = useState(null); // Resultado de la mezcla
    const [mezclasGuardadas, setMezclasGuardadas] = useState([]); // Lista de mezclas que hemos guardado


    // Efecto que se ejecuta al cargar el componente
    
    useEffect(() => {
    // Cargamos las mezclas guardadas desde el localStorage
    try {
    const mezclasGuardadasLocal =

    JSON.parse(localStorage.getItem("colorMixes")) || [];
    setMezclasGuardadas(mezclasGuardadasLocal);
    } catch (error) {
    // Si hay error, empezamos con array vacío
    console.error("Error cargando mezclas guardadas:", error);
    setMezclasGuardadas([]);
    }
  }, []); // Se ejecuta solo una vez al montar el componente

    // Función para mezclar dos colores hexadecimales
    const mezclarColores = () => {
    // Quitamos el símbolo # de los colores para trabajar solo con los números
    const hex1 = color1.replace("#", "");
    const hex2 = color2.replace("#", "");

    // Convertimos el primer color hexadecimal a componentes RGB (Red, Green, Blue)
    // parseInt convierte de base 16 (hexadecimal) a base 10 (decimal)
    const r1 = parseInt(hex1.substr(0, 2), 16); // Primeros 2 caracteres = componente Rojo
    const g1 = parseInt(hex1.substr(2, 2), 16); // Siguientes 2 caracteres = componente Verde
    const b1 = parseInt(hex1.substr(4, 2), 16); // Últimos 2 caracteres = componente Azul

    // Convertimos el segundo color hexadecimal a componentes RGB
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);

    // Calculamos el promedio de cada componente RGB para mezclar los colores
    const rMezclado = Math.round((r1 + r2) / 2);
    const gMezclado = Math.round((g1 + g2) / 2);
    const bMezclado = Math.round((b1 + b2) / 2);

    // Convertimos los componentes RGB mezclados de vuelta a hexadecimal
    // toString(16) convierte a hexadecimal, padStart asegura que tenga 2 caracteres
    const hexMezclado = `#${rMezclado.toString(16).padStart(2, "0")}${gMezclado
    .toString(16)
    .padStart(2, "0")}${bMezclado.toString(16).padStart(2, "0")}`;

    // Creamos un objeto con toda la información de la mezcla
    const mezcla = {
        id: Date.now(), // Usamos el timestamp como ID único
        color1: color1, // Guardamos el primer color original
        color2: color2, // Guardamos el segundo color original
        colorMezclado: hexMezclado, // Guardamos el resultado de la mezcla
        fecha: new Date().toLocaleString(), // Fecha y hora actual en formato local
    };

    // Guardamos la mezcla en el estado
    setColorMezclado(mezcla);
    };

    // Función para guardar la mezcla actual en el localStorage
    const guardarMezcla = () => {
    if (colorMezclado) {
    // Creamos un nuevo array con la mezcla actual al final
    const nuevasMezclas = [...mezclasGuardadas, colorMezclado];

    // Actualizamos el estado
    setMezclasGuardadas(nuevasMezclas);

    // Guardamos en el localStorage
    localStorage.setItem("colorMixes", JSON.stringify(nuevasMezclas));
    }
    };

// Función para eliminar una mezcla guardada
const eliminarMezcla = (id) => {
// Filtramos el array para quitar solo la mezcla con el ID especificado
const nuevasMezclas = mezclasGuardadas.filter((mezcla) => mezcla.id !== id);

// Actualizamos el estado
setMezclasGuardadas(nuevasMezclas);

// Actualizamos el localStorage
    localStorage.setItem("colorMixes", JSON.stringify(nuevasMezclas));
    };

return (
    <div className="mezclador">
    <h2 className="panel-title">Mezclador de Colores</h2>

    <div className="controles-mezclador">
        <div className="color-selector">
        <div className="color-input-group">
            <label>Color 1:</label>
            <input
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className="color-picker"
            />
            <input
            type="text"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className="color-text"
            placeholder="#ff0000"
            />
        </div>

        <div className="color-input-group">
            <label>Color 2:</label>
            <input
            type="color"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            className="color-picker"
            />
            <input
            type="text"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            className="color-text"
            placeholder="#0000ff"
            />
        </div>
        </div>

        <button onClick={mezclarColores} className="mezclar-button">
        Mezclar Colores
        </button>
        </div>

    {/* Mostramos el resultado solo si hay una mezcla calculada */}
    {colorMezclado && (
        <div className="resultado-mezcla">
        <h3>¡Resultado de la Mezcla!</h3>
        <div className="tarjetas-colores">
            <div className="tarjeta-color">
            <div className="muestra-color"style={{ backgroundColor: colorMezclado.color1 }}>
            </div>
            <span className="color-label">Color 1</span>
            <span className="color-value">{colorMezclado.color1}</span>
            </div>

            <div className="simbolo-mezcla">+</div>

            <div className="tarjeta-color">
            <div className="muestra-color"style={{ backgroundColor: colorMezclado.color2 }}></div>
            <span className="color-label">Color 2</span>
            <span className="color-value">{colorMezclado.color2}</span>
            </div>

            <div className="simbolo-mezcla">=</div>

            <div className="tarjeta-color mezclado">
            <div className="muestra-color"style={{ backgroundColor: colorMezclado.colorMezclado }}></div>
            <span className="color-label">Color Mezclado</span>
            <span className="color-value">{colorMezclado.colorMezclado}</span>
            </div>
            </div>

            <button onClick={guardarMezcla} className="guardar-mezcla-button">
            Guardar Esta Mezcla
            </button>
        </div>
        )}

        <div className="mezclas-guardadas">
        <h3>Mis Mezclas Guardadas:</h3>
        <div className="lista-mezclas">
          {/* Mapeamos cada mezcla guardada para mostrar una fila en la lista */}
        {mezclasGuardadas.map((mezcla) => (
            <div key={mezcla.id} className="mezcla-guardada">
            <div className="mezcla-info">
                <div className="mini-colores">
                <div
                    className="mini-color"
                    style={{ backgroundColor: mezcla.color1 }}
                    title={mezcla.color1}
                ></div>
                <span className="simbolo-mini">+</span>
                <div
                    className="mini-color"
                    style={{ backgroundColor: mezcla.color2 }}
                    title={mezcla.color2}
                ></div>
                <span className="simbolo-mini">=</span>
                <div
                    className="mini-color resultado"
                    style={{ backgroundColor: mezcla.colorMezclado }}
                    title={mezcla.colorMezclado}
                ></div>
                </div>
                <span className="mezcla-fecha">Creada: {mezcla.fecha}</span>
            </div>
            <button
                onClick={() => eliminarMezcla(mezcla.id)}
                className="eliminar-mezcla-button"
            >
                Eliminar
            </button>
            </div>
            ))}
          {/* Mensaje cuando no hay mezclas guardadas */}
            {mezclasGuardadas.length === 0 && (
            <p className="no-mezclas">
            Aún no tienes mezclas guardadas. ¡Mezcla algunos colores y
            guárdalos!
            </p>
            )}
        </div>
        </div>
    </div>
    );
}

export default Mezclador;
