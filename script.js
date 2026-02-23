const productos = [
    { id: 1, nombre: "Medio Ambiente", descripcion: "El medio ambiente es el entorno que nos rodea y que influye en nuestra vida diaria. Es importante cuidar el medio ambiente para garantizar un futuro sostenible para las próximas generaciones. Algunas formas de cuidar el medio ambiente incluyen reducir el consumo de energía, reciclar, utilizar transporte público o bicicletas, y apoyar políticas ambientales."},
    { id: 2, nombre: "Tecnologia", descripcion: "La tecnología es el conjunto de conocimientos, habilidades, técnicas y procesos que se utilizan para crear productos, servicios o sistemas que resuelven problemas o mejoran la calidad de vida. La tecnología abarca una amplia gama de áreas, incluyendo la informática, la electrónica, la biotecnología, la inteligencia artificial, entre otras. En la actualidad, la tecnología juega un papel fundamental en nuestra vida diaria, desde la comunicación hasta el entretenimiento, la educación y el trabajo. La innovación tecnológica continúa avanzando a un ritmo acelerado, lo que nos permite acceder a nuevas herramientas y soluciones para enfrentar los desafíos del mundo moderno."},
    { id: 3, nombre: "Salud", descripcion: "La salud es un estado de bienestar físico, mental y social. Mantener una buena salud implica adoptar hábitos saludables como una alimentación equilibrada, hacer ejercicio regularmente, dormir lo suficiente y evitar hábitos perjudiciales como fumar o consumir alcohol en exceso. Además, es importante recibir atención médica adecuada cuando sea necesario."}
];

function mostrarProductos(productos) {
    const container = document.getElementById('product_container');
    container.innerHTML = '';
    
    productos.forEach((producto) => {
        const html = `
            <div class="producto">
                <h2>${producto.nombre}</h2>
                <p>${producto.descripcion}</p>
            </div>
        `;
        container.innerHTML += html;
    });
}

mostrarProductos(productos);
