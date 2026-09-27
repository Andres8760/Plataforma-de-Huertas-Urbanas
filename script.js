let huertas = [];
let usuarios = cargarUsuarios();
let sesion = cargarSesion(); // null = invitado, o { nombres, apellidos, usuario, correo, clave }


function cargarUsuarios() {
    try {
        return JSON.parse(localStorage.getItem("ecohuertos_usuarios")) || [];
    } catch (error) {
        return [];
    }
}

function guardarUsuarios() {
    localStorage.setItem("ecohuertos_usuarios", JSON.stringify(usuarios));
}

function cargarSesion() {
    try {
        return JSON.parse(localStorage.getItem("ecohuertos_sesion"));
    } catch (error) {
        return null;
    }
}

function guardarSesion() {
    if (sesion) {
        localStorage.setItem("ecohuertos_sesion", JSON.stringify(sesion));
    } else {
        localStorage.removeItem("ecohuertos_sesion");
    }
}

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

    const misHuertas = huertas.filter(h => h.autor === sesion.usuario);

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
        autor: sesion ? sesion.usuario : null
    };

    huertas.push(nuevaHuerta);
    renderizarHuertas();
    formulario.reset();
});

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

function mostrarErrorFormulario(idError, mensaje) {
    const elemento = document.getElementById(idError);
    elemento.textContent = mensaje;
    elemento.classList.remove("oculto");
}

function ocultarErrorFormulario(idError) {
    document.getElementById(idError).classList.add("oculto");
}

function actualizarUISesion() {
    if (sesion) {
        authInvitado.classList.add("oculto");
        authUsuario.classList.remove("oculto");
        nombreUsuarioSpan.textContent = sesion.usuario;
        tabProyecto.classList.remove("oculto");

        document.getElementById("info-nombre-completo").textContent =
            `${sesion.nombres} ${sesion.apellidos}`;
        document.getElementById("info-usuario").textContent = sesion.usuario;
        document.getElementById("info-correo").textContent = sesion.correo;
    } else {
        authUsuario.classList.add("oculto");
        authInvitado.classList.remove("oculto");
        tabProyecto.classList.add("oculto");
    }

    renderizarMisHuertas();
}

function iniciarSesion(usuario) {
    sesion = usuario;
    guardarSesion();
    actualizarUISesion();
}

function cerrarSesion() {
    sesion = null;
    guardarSesion();
    actualizarUISesion();
    mostrarVista("inicio");
}

document.getElementById("form-login").addEventListener("submit", (evento) => {
    evento.preventDefault();
    ocultarErrorFormulario("error-login");

    const identificador = document.getElementById("login-identificador").value.trim().toLowerCase();
    const clave = document.getElementById("login-clave").value;

    const usuario = usuarios.find(u =>
        u.usuario.toLowerCase() === identificador || u.correo.toLowerCase() === identificador
    );

    if (!usuario) {
        mostrarErrorFormulario("error-login", "No encontramos una cuenta con ese usuario o correo.");
        return;
    }

    if (usuario.clave !== clave) {
        mostrarErrorFormulario("error-login", "La contraseña es incorrecta.");
        return;
    }

    iniciarSesion(usuario);
    cerrarModal(modalLogin);
    evento.target.reset();
    mostrarVista("inicio");
});

document.getElementById("form-registro").addEventListener("submit", (evento) => {
    evento.preventDefault();
    ocultarErrorFormulario("error-registro");

    const nombres = document.getElementById("registro-nombres").value.trim();
    const apellidos = document.getElementById("registro-apellidos").value.trim();
    const usuario = document.getElementById("registro-usuario").value.trim();
    const correo = document.getElementById("registro-correo").value.trim();
    const clave = document.getElementById("registro-clave").value;

    const usuarioDuplicado = usuarios.some(u => u.usuario.toLowerCase() === usuario.toLowerCase());
    const correoDuplicado = usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase());

    if (usuarioDuplicado) {
        mostrarErrorFormulario("error-registro", "Ese nombre de usuario ya está en uso.");
        return;
    }

    if (correoDuplicado) {
        mostrarErrorFormulario("error-registro", "Ya existe una cuenta con ese correo.");
        return;
    }

    const nuevoUsuario = { nombres, apellidos, usuario, correo, clave };
    usuarios.push(nuevoUsuario);
    guardarUsuarios();

    iniciarSesion(nuevoUsuario);
    cerrarModal(modalRegistro);
    evento.target.reset();
    mostrarVista("inicio");
});

document.getElementById("btn-salir").addEventListener("click", cerrarSesion);

/* ===================== INICIO ===================== */

actualizarUISesion();
renderizarHuertas();
