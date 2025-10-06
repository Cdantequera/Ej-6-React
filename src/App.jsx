import { useState } from 'react'
import './App.css'
import MainContent from './components/MainContent/MainContent'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import LeftAside from './components/LeftAside/LeftAside'
import GlobosFlotadores from './components/GlobosFlotadores/GlobosFlotadores'

function App() {
  const [activeExample, setActiveExample] = useState(null)
  
  return (
    <>
      <GlobosFlotadores />
      <div className="layout-container">
        <Header />
        <LeftAside setActiveExample={setActiveExample} />
        <MainContent activeExample={activeExample} />
        <Footer />
      </div>
    </>
  )
}

export default App