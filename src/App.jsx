import { useState } from 'react'
import './App.css'
import Header from './Header'
import Tabla from './Tabla'
import TablaFlujos from './TablaFlujos';

function App() {
  const [flujos, setFlujos] = useState([]);

  return (
    <>
      <Header/>
      <Tabla setFlujos={setFlujos} />
      {flujos.length > 0 && <TablaFlujos flujos={flujos}/>}
    </>
  )
}

export default App;
