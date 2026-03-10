import Header from './components/header';
import Footer from './components/footer';
import './App.css';
import { useState } from 'react';
import CRUDProyectos from './components/CRUDProyectos';
import CRUDTareas from './components/CRUDtareas';
import CRUDUsuarios from './components/CRUDusuarios';


function App() {
const [section, setSection] = useState(null);
  return (

    <div className="App">
      <Header onSelect={setSection} />
      <main> {section === "creacion_proyectos" && (
          <section id="creacion_proyectos">
            <CRUDProyectos />
          </section> )}
        {section === "asignacion_tareas" && (
          <section id="asignacion_tareas">
            <CRUDTareas />
          </section>)}
        {section === "gestion_usuarios" && (
          <section id="gestion_usuarios">
            <CRUDUsuarios />
          </section>)}
      </main>
      <Footer />
    </div>
  );
}

export default App;
