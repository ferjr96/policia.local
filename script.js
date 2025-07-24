// JavaScript del test interactivo


let preguntaActual = 0;
let respuestasCorrectas = 0;
let respuestasUsuario = Array(preguntas.length).fill(null);

document.addEventListener('DOMContentLoaded', function() {
    preguntas.forEach(p => {
        const correctaOriginal = p.opciones[p.correcta];
        p.opciones = mezclarArray(p.opciones);
        p.correcta = p.opciones.indexOf(correctaOriginal);
    });

    document.getElementById('total-preguntas').textContent = preguntas.length;
    generarIndice();
    mostrarPregunta(preguntaActual);
    actualizarControlesNavegacion();
});

function mezclarArray(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function generarIndice() {
    const indice = document.getElementById('indice');
    indice.innerHTML = '';
    preguntas.forEach((_, index) => {
        const numero = document.createElement('div');
        numero.className = 'numero-pregunta';
        numero.textContent = index + 1;
        numero.onclick = function() { irAPregunta(index); };
        indice.appendChild(numero);
    });
}

function irAPregunta(num) {
    preguntaActual = num;
    mostrarPregunta(preguntaActual);
    actualizarControlesNavegacion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarPregunta(num) {
    const form = document.getElementById('testForm');
    form.innerHTML = '';

    const pregunta = preguntas[num];
    const divPregunta = document.createElement('div');
    divPregunta.className = 'pregunta';

    const pTexto = document.createElement('p');
    pTexto.textContent = pregunta.pregunta;
    divPregunta.appendChild(pTexto);

    pregunta.opciones.forEach((opcion, index) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'pregunta';
        input.value = index;
        input.onclick = function() { verificarRespuesta(index); };

        if (respuestasUsuario[num] !== null) {
            input.disabled = true;
            if (index === pregunta.correcta) {
                label.classList.add('correcta');
            } else if (index === respuestasUsuario[num] && respuestasUsuario[num] !== pregunta.correcta) {
                label.classList.add('incorrecta');
            }
        }

        label.appendChild(input);
        label.appendChild(document.createTextNode(opcion));
        divPregunta.appendChild(label);
    });

    if (respuestasUsuario[num] !== null) {
        const divExplicacion = document.createElement('div');
        divExplicacion.className = 'explicacion';
        divExplicacion.textContent = pregunta.explicación;
        divExplicacion.style.display = 'block';
        divPregunta.appendChild(divExplicacion);
    }

    form.appendChild(divPregunta);
    document.getElementById('pregunta-actual').textContent = num + 1;
    actualizarIndice();
}

function actualizarIndice() {
    const numeros = document.querySelectorAll('.numero-pregunta');
    numeros.forEach((numero, index) => {
        numero.classList.remove('respondida', 'respondida-incorrecta');
        if (respuestasUsuario[index] !== null) {
            if (respuestasUsuario[index] === preguntas[index].correcta) {
                numero.classList.add('respondida');
            } else {
                numero.classList.add('respondida-incorrecta');
            }
        }
    });
}

function verificarRespuesta(opcionSeleccionada) {
    const pregunta = preguntas[preguntaActual];
    const respuestaAnterior = respuestasUsuario[preguntaActual];
    respuestasUsuario[preguntaActual] = opcionSeleccionada;

    if (respuestaAnterior === null) {
        if (opcionSeleccionada === pregunta.correcta) respuestasCorrectas++;
    } else {
        if (respuestaAnterior === pregunta.correcta) respuestasCorrectas--;
        if (opcionSeleccionada === pregunta.correcta) respuestasCorrectas++;
    }

    mostrarPregunta(preguntaActual);
    actualizarResultado();
    actualizarControlesNavegacion();
}

function actualizarResultado() {
    const preguntasRespondidas = respuestasUsuario.filter(r => r !== null).length;
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <p>Respuestas correctas: ${respuestasCorrectas} de ${preguntasRespondidas}</p>
        <p>Porcentaje de aciertos: ${preguntasRespondidas > 0 ? ((respuestasCorrectas / preguntasRespondidas) * 100).toFixed(1) : 0}%</p>
    `;
    resultadoDiv.style.display = 'block';
}

function actualizarControlesNavegacion() {
    document.getElementById('anterior-btn').style.display = preguntaActual === 0 ? 'none' : 'block';
    document.getElementById('siguiente-btn').style.display = preguntaActual === preguntas.length - 1 ? 'none' : 'block';
    document.getElementById('finalizar-btn').style.display = preguntaActual === preguntas.length - 1 ? 'block' : 'none';
}

function siguientePregunta() {
    if (preguntaActual < preguntas.length - 1) {
        preguntaActual++;
        mostrarPregunta(preguntaActual);
        actualizarControlesNavegacion();
    }
}

function anteriorPregunta() {
    if (preguntaActual > 0) {
        preguntaActual--;
        mostrarPregunta(preguntaActual);
        actualizarControlesNavegacion();
    }
}

function finalizarTest() {
    const preguntasRespondidas = respuestasUsuario.filter(r => r !== null).length;
    document.getElementById('resultado').innerHTML = `
        <h3>Test completado</h3>
        <p>Has respondido ${preguntasRespondidas} de ${preguntas.length} preguntas.</p>
        <p>Respuestas correctas: ${respuestasCorrectas} (${preguntasRespondidas > 0 ? ((respuestasCorrectas / preguntasRespondidas) * 100).toFixed(1) : 0}%)</p>
        <p>Respuestas incorrectas: ${preguntasRespondidas - respuestasCorrectas}</p>
        <p>Preguntas sin responder: ${preguntas.length - preguntasRespondidas}</p>
    `;
    const reintentarBtn = document.getElementById('reintentar-incorrectas-btn');
    if (reintentarBtn) reintentarBtn.style.display = 'block';
}

function reintentarIncorrectas() {
    const preguntasIncorrectas = preguntas
        .map((pregunta, index) => ({ ...pregunta, indexOriginal: index }))
        .filter((_, index) => respuestasUsuario[index] !== null && respuestasUsuario[index] !== preguntas[index].correcta);

    if (preguntasIncorrectas.length === 0) {
        alert('No has fallado ninguna pregunta.');
        return;
    }

    preguntasIncorrectas.forEach(p => {
        const correctaOriginal = p.opciones[p.correcta];
        p.opciones = mezclarArray(p.opciones);
        p.correcta = p.opciones.indexOf(correctaOriginal);
    });

    preguntaActual = 0;
    respuestasCorrectas = 0;
    respuestasUsuario = Array(preguntasIncorrectas.length).fill(null);

    preguntas.splice(0, preguntas.length, ...preguntasIncorrectas);

    document.getElementById('reintentar-incorrectas-btn').style.display = 'none';
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('finalizar-btn').style.display = 'none';

    generarIndice();
    mostrarPregunta(preguntaActual);
    actualizarControlesNavegacion();
}