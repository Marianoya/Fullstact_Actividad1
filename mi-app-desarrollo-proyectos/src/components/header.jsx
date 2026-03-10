import React from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

function Header({ onSelect }) {
    return (
        <header>
            <div className="d-grid gap-2">
                <Button variant="outline-info" size="lg">
                
                Gestion de Proyectos para desarrollo de software

                </Button> </div>
            {/* <h1 className="text-center bg-primary text-white py-3 rounded shadow"> Gestion de Proyectos para desarrollo de software </h1> */}
            <Nav>
    
            <ul className="nav nav-tabs">
                <li className="nav-item">
                 <a className="nav-link active" aria-current="page" href="#">Selecciona el Tipo de Gestion de desarrollo</a>
                </li>
                <li className="nav-item dropdown">
                 <a 
                 className="nav-link dropdown-toggle link-warning" 
                 data-bs-toggle="dropdown" 
                 href="#" 
                 role="button" 
                 aria-expanded="false">
                    Gestor
                    </a>
                 <ul className="dropdown-menu">
                    <li>
                        <a 
                    className="dropdown-item" 
                    href="#creacion_proyectos" 
                    onClick={()=> onSelect("creacion_proyectos")}
                    >
                        Creacion de Proyectos
                        </a>
                        </li>
                    <li>
                        <a 
                        className="dropdown-item" 
                        href="#asignacion_tareas" 
                        onClick={()=> onSelect("asignacion_tareas")}
                        >
                            Asignacion de Tareas
                            </a>
                            </li>
                    <li>
                        <a 
                        className="dropdown-item" 
                        href="#gestion_usuarios" 
                        onClick={()=> onSelect("gestion_usuarios")}>
                            Gestion de Usuarios
                            </a>
                        </li>
                  </ul>
                </li>
                
            </ul>
            </Nav>
        </header>);}

export default Header;

