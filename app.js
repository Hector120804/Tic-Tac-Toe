let jugador = "X";
let computadora = "O";
let tablero = ["", "", "", "", "", "", "", "", ""];
let tiempoInicio;
let cronometrando = false;
let juegoTerminado = false;
let turnoComputadora = false;

const celdas = document.querySelectorAll(".celda");
const mensaje = document.getElementById("mensaje");
const tablaMejoresTiempos = document.getElementById("tablaMejoresTiempos");
const turnoIndicador = document.getElementById("turno-indicador");

celdas.forEach((celda, index) => {
    celda.addEventListener("click", () => {
        if (!cronometrando) {
            iniciarCronometro();
        }
        if (tablero[index] === "" && !juegoTerminado && !turnoComputadora) {
            moverJugador(index);
            if (!verificarGanador(jugador) && tablero.includes("")) {
                turnoIndicador.innerText = "Turno: Computadora";
                turnoComputadora = true; 
                setTimeout(moverComputadora, 3000);
            }
        }
    });
});

function moverJugador(index) {
    tablero[index] = jugador;
    celdas[index].innerText = jugador;
    celdas[index].classList.add("selected");
    if (verificarGanador(jugador)) {
        detenerCronometro();
        guardarTiempo();
        mensaje.innerText = "¡Ganaste!";
        juegoTerminado = true;
        turnoIndicador.innerText = "Juego terminado";
        turnoIndicador.style.color = "black";
    } else if (!tablero.includes("")) {
        mensaje.innerText = "Empate";
        juegoTerminado = true;
        turnoIndicador.innerText = "Juego terminado";
        turnoIndicador.style.color = "black"; 
    } else {
        turnoIndicador.innerText = "Turno: Computadora";
        turnoIndicador.style.color = "red";
        turnoComputadora = true;
        setTimeout(moverComputadora, 3000);
    }
}

function moverComputadora() {
    if (juegoTerminado) return;

    let movimientosDisponibles = tablero.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    let movimientoAleatorio = movimientosDisponibles[Math.floor(Math.random() * movimientosDisponibles.length)];
    tablero[movimientoAleatorio] = computadora;
    celdas[movimientoAleatorio].innerText = computadora;
    celdas[movimientoAleatorio].classList.add("selected");

    if (verificarGanador(computadora)) {
        mensaje.innerText = "La computadora ganó";
        detenerCronometro();
        juegoTerminado = true;
        turnoIndicador.innerText = "Juego terminado";
        turnoIndicador.style.color = "black";
    } else {
        turnoIndicador.innerText = "Turno: Jugador X";
        turnoIndicador.style.color = "green";
    }
    turnoComputadora = false;
}

function verificarGanador(jugadorActual) {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return combinacionesGanadoras.some(combinacion =>
        combinacion.every(index => tablero[index] === jugadorActual)
    );
}

function iniciarCronometro() {
    tiempoInicio = new Date();
    cronometrando = true;
}

function detenerCronometro() {
    cronometrando = false;
}

function guardarTiempo() {
    let tiempoFin = new Date();
    let tiempoTotal = Math.floor((tiempoFin - tiempoInicio) / 1000);
    let nombre = prompt("¡Ganaste! Ingresa tu nombre para registrar el tiempo:");

    if (nombre) {
        let nuevoRegistro = { nombre, tiempo: tiempoTotal, fecha: new Date().toLocaleString() };
        let mejoresTiempos = JSON.parse(localStorage.getItem("mejoresTiempos")) || [];
        mejoresTiempos.push(nuevoRegistro);
        mejoresTiempos.sort((a, b) => a.tiempo - b.tiempo);
        mejoresTiempos = mejoresTiempos.slice(0, 10);
        localStorage.setItem("mejoresTiempos", JSON.stringify(mejoresTiempos));
        mostrarMejoresTiempos();
    }
}

function mostrarMejoresTiempos() {
    let mejoresTiempos = JSON.parse(localStorage.getItem("mejoresTiempos")) || [];
    tablaMejoresTiempos.innerHTML = `
        <tr>
            <th>👤 Nombre</th> <!-- Emoticono de usuario en la cabecera de nombres -->
            <th>⏱️ Tiempo (s)</th> <!-- Emoticono de reloj para tiempo -->
            <th>📅 Fecha y Hora</th> <!-- Emoticono de calendario para fecha y hora -->
        </tr>
    ` + mejoresTiempos.map(registro => `
        <tr>
            <td>👤 ${registro.nombre}</td> <!-- Emoticono de usuario solo en la columna de nombre -->
            <td>⏱️ ${registro.tiempo}</td> <!-- Emoticono solo en tiempo -->
            <td>📅 ${registro.fecha}</td> <!-- Emoticono solo en fecha -->
        </tr>
    `).join("");
}

function resetearJuego() {
    tablero = ["", "", "", "", "", "", "", "", ""];
    celdas.forEach(celda => {
        celda.innerText = "";
        celda.classList.remove("selected");
    });
    mensaje.innerText = "";
    turnoIndicador.innerText = "Turno: Jugador X";
    cronometrando = false;
    juegoTerminado = false;
    turnoComputadora = false;
}

mostrarMejoresTiempos();