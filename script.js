const formulario = document.getElementById("form-huerta");
const contenedorHuertas = document.getElementById("contenedor-huertas");

let huertas = [];

function crearTarjetaHuerta(huerta) {

    const tarjeta = document.createElement("article");

    tarjeta.className = "tarjeta-caso";

    tarjeta.innerHTML = `
        <h3>${huerta.nombre}</h3>
        <p>Ubicación: ${huerta.ubicacion}</p>
        <p>Cultivo: ${huerta.cultivo}</p>
    `;

    return tarjeta;
}

function renderizarHuertas() {

    contenedorHuertas.innerHTML = "";

    if (huertas.length === 0) {
        contenedorHuertas.innerHTML =
            "<p>Aún no hay huertas registradas.</p>";
        return;
    }

    huertas.forEach(huerta => {
        const tarjeta = crearTarjetaHuerta(huerta);
        contenedorHuertas.appendChild(tarjeta);
    });
}

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const nuevaHuerta = {
        nombre: document.getElementById("nombre").value,
        ubicacion: document.getElementById("ubicacion").value,
        cultivo: document.getElementById("cultivo").value
    };

    huertas.push(nuevaHuerta);

    renderizarHuertas();

    formulario.reset();
});

renderizarHuertas();
