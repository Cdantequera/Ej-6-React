import React from 'react'
import './MainContent.css'
import ColorManager from '../ColorManager/ColorManager'
import Mezclador from '../Mezclador/Mezclador'
import ColorApi from '../ColorApi/ColorApi'

function MainContent({ activeExample }) {
  return (
    <main>
      {activeExample === 1 && <ColorManager />}
      {activeExample === 2 && <Mezclador />}
      {activeExample === 3 && <ColorApi />}
    </main>
  )
}

export default MainContent