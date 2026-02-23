import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import './App.css';
import MedioAmbiente from './components/medioAmbiente';
import Tecnologia from './components/tecnologia';
import Salud from './components/salud';
import { useState } from 'react';

function App() {
const [section, setSection] = useState(null);
  return (
    <div className="App">
      <Header onSelect={setSection} />
      <main> {section === "medioAmbiente" && (
          <section id="medioAmbiente">
            <MedioAmbiente/>
          </section> )}
        {section === "tecnologia" && (
          <section id="tecnologia">
            <Tecnologia />
          </section>)}
        {section === "salud" && (
          <section id="salud">
            <Salud />
          </section> )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
