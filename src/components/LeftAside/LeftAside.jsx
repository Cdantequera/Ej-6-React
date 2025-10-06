import React from 'react'
import './LeftAside.css'

function LeftAside({ setActiveExample }) {
  return (
    <aside className='aside-left'>
      <h2 className="panel-title">Navegación</h2>
      <button className="button-aside" onClick={() => setActiveExample(1)}>
        Ejemplo 1
      </button>
      <button className="button-aside" onClick={() => setActiveExample(2)}>
        Ejemplo 2
      </button>
      <button className="button-aside" onClick={() => setActiveExample(3)}>
        Ejemplo 3
      </button>
    </aside>
  )
}

export default LeftAside