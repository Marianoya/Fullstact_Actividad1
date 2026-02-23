import React from "react";

function Header({ onSelect }) {
    return (
        <header>
            <h1>Web informativa</h1>
            <nav>
                <ul>
                    <li><a href="#medioAmbiente" onClick={()=> onSelect("medioAmbiente")}>Medio Ambiente</a></li>
                    <li><a href="#tecnologia" onClick={()=> onSelect("tecnologia")}>Tecnología</a></li>
                    <li><a href="#salud" onClick={()=> onSelect("salud")}>Salud</a></li>
                </ul>
            </nav>
        </header>);}

export default Header;

