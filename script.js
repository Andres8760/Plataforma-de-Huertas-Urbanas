/* ===================== ESTADO ===================== */

let huertas = [];
let sesion = null; // null = invitado, o { nombre, correo }

/* ===================== ELEMENTOS ===================== */

const formulario = document.getElementById("form-huerta");
const contenedorHuertas = document.getElementById("contenedor-huertas");
const contenedorMisHuertas = document.getElementById("contenedor-mis-huertas");

const tabs = document.querySelectorAll(".tab");
const vistas = document.querySelectorAll(".vista");
const tabProyecto = document.getElementById("tab-proyecto");

const authInvitado = document.getElementById("auth-invitado");
const authUsuario = document.getElementById("auth-usuario");
const nombreUsuarioSpan = document.getElementById("nombre-usuario");

const modalLogin = document.getElementById("modal-login");
const modalRegistro = document.getElementById("modal-registro");

/* ===================== HUERTAS ===================== */

function crearTarjetaHuerta(huerta) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-caso";
    tarjeta.innerHTML = `
        <h3>${huerta.nombre}</h3>
        <p>Ubicación: ${huerta.ubicacion}</p>
        <p>Cultivo: ${huerta.cultivo}</p>
        ${huerta.autor ? `<p>Registrada por: ${huerta.autor}</p>` : ""}
    `;
    return tarjeta;
}

function renderizarHuertas() {
    contenedorHuertas.innerHTML = "";

    if (huertas.length === 0) {
        contenedorHuertas.innerHTML = "<p>Aún no hay huertas registradas.</p>";
    } else {
        huertas.forEach(huerta => {
            contenedorHuertas.appendChild(crearTarjetaHuerta(huerta));
        });
    }

    renderizarMisHuertas();
}

function renderizarMisHuertas() {
    if (!contenedorMisHuertas) return;

    contenedorMisHuertas.innerHTML = "";

    if (!sesion) {
        contenedorMisHuertas.innerHTML = "<p>Inicia sesión para ver tus huertas registradas.</p>";
        return;
    }

    const misHuertas = huertas.filter(h => h.autor === sesion.nombre);

    if (misHuertas.length === 0) {
        contenedorMisHuertas.innerHTML = "<p>Todavía no has registrado ninguna huerta.</p>";
        return;
    }

    misHuertas.forEach(huerta => {
        contenedorMisHuertas.appendChild(crearTarjetaHuerta(huerta));
    });
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nuevaHuerta = {
        nombre: document.getElementById("nombre").value,
        ubicacion: document.getElementById("ubicacion").value,
        cultivo: document.getElementById("cultivo").value,
        autor: sesion ? sesion.nombre : null
    };

    huertas.push(nuevaHuerta);
    renderizarHuertas();
    formulario.reset();
});

/* ===================== NAVEGACIÓN ENTRE VISTAS ===================== */

function mostrarVista(nombreVista) {
    if (nombreVista === "proyecto" && !sesion) {
        abrirModal(modalLogin);
        return;
    }

    vistas.forEach(vista => vista.classList.remove("vista-activa"));
    tabs.forEach(tab => tab.classList.remove("tab-activa"));

    document.getElementById(`vista-${nombreVista}`).classList.add("vista-activa");

    const tabActiva = document.querySelector(`.tab[data-vista="${nombreVista}"]`);
    if (tabActiva) tabActiva.classList.add("tab-activa");

    window.scrollTo({ top: 0, behavior: "instant" });
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => mostrarVista(tab.dataset.vista));
});

document.getElementById("btn-hero-registro").addEventListener("click", () => {
    mostrarVista("huertas");
});

/* ===================== SUBPESTAÑAS: MI PROYECTO ===================== */

const subtabs = document.querySelectorAll(".subtab");
const paneles = document.querySelectorAll(".panel");

subtabs.forEach(subtab => {
    subtab.addEventListener("click", () => {
        subtabs.forEach(s => s.classList.remove("subtab-activa"));
        paneles.forEach(p => p.classList.remove("panel-activo"));

        subtab.classList.add("subtab-activa");
        document.getElementById(subtab.dataset.panel).classList.add("panel-activo");
    });
});

/* ===================== MODALES ===================== */

function abrirModal(modal) {
    modal.classList.remove("oculto");
}

function cerrarModal(modal) {
    modal.classList.add("oculto");
}

document.getElementById("btn-abrir-login").addEventListener("click", () => abrirModal(modalLogin));
document.getElementById("btn-abrir-registro").addEventListener("click", () => abrirModal(modalRegistro));

document.querySelectorAll("[data-cerrar]").forEach(boton => {
    boton.addEventListener("click", () => {
        cerrarModal(document.getElementById(boton.dataset.cerrar));
    });
});

[modalLogin, modalRegistro].forEach(modal => {
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) cerrarModal(modal);
    });
});

/* ===================== SESIÓN (simulada, sin backend) ===================== */

function iniciarSesion(nombre, correo) {
    sesion = { nombre, correo };

    authInvitado.classList.add("oculto");
    authUsuario.classList.remove("oculto");
    nombreUsuarioSpan.textContent = nombre;
    tabProyecto.classList.remove("oculto");

    document.getElementById("info-nombre").textContent = nombre;
    document.getElementById("info-correo").textContent = correo;

    renderizarMisHuertas();
}

function cerrarSesion() {
    sesion = null;

    authUsuario.classList.add("oculto");
    authInvitado.classList.remove("oculto");
    tabProyecto.classList.add("oculto");

    mostrarVista("inicio");
}

document.getElementById("form-login").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const correo = document.getElementById("login-correo").value;
    const nombre = correo.split("@")[0];

    iniciarSesion(nombre, correo);
    cerrarModal(modalLogin);
    evento.target.reset();
    mostrarVista("proyecto");
});

document.getElementById("form-registro").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.getElementById("registro-nombre").value;
    const correo = document.getElementById("registro-correo").value;

    iniciarSesion(nombre, correo);
    cerrarModal(modalRegistro);
    evento.target.reset();
    mostrarVista("proyecto");
});

document.getElementById("btn-salir").addEventListener("click", cerrarSesion);

/* ===================== INICIO ===================== */

renderizarHuertas();
