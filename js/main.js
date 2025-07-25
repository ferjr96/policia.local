// Script vacío. Agrega tu JS aquí.
let preguntaActual = 0;
        let respuestasCorrectas = 0;
        let respuestasUsuario = Array(preguntas.length).fill(null);

        // Mostrar la primera pregunta al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
        preguntas.forEach(p => {
            // Guardamos la opción correcta original
            const correctaOriginal = p.opciones[p.correcta];
            // Mezclamos las opciones
            p.opciones = mezclarArray(p.opciones);
            // Actualizamos el índice de la nueva correcta
            p.correcta = p.opciones.indexOf(correctaOriginal);
        });

            document.getElementById('total-preguntas').textContent = preguntas.length;
            generarIndice();
            mostrarPregunta(preguntaActual);
            actualizarControlesNavegacion();
        });
        
        //para mezclar
            function mezclarArray(array) {
            const copia = [...array];
            for (let i = copia.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copia[i], copia[j]] = [copia[j], copia[i]];
            }
            return copia;
            }

        


        // Función para generar el índice de preguntas
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

        // Función para ir a una pregunta específica
        function irAPregunta(num) {
            preguntaActual = num;
            mostrarPregunta(preguntaActual);
            actualizarControlesNavegacion();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Función para mostrar una pregunta
        function mostrarPregunta(num) {
            const form = document.getElementById('testForm');
            form.innerHTML = '';
            
            const pregunta = preguntas[num];
            
            const divPregunta = document.createElement('div');
            divPregunta.className = 'pregunta';
            
            const pTexto = document.createElement('p');
            pTexto.textContent = pregunta.pregunta;
            divPregunta.appendChild(pTexto);
            
            // Crear opciones de respuesta
            pregunta.opciones.forEach((opcion, index) => {
                const label = document.createElement('label');
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'pregunta';
                input.value = index;
                input.onclick = function() { verificarRespuesta(index); };
                
                // Verificar si ya se respondió esta pregunta
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
            
            // Mostrar explicación si ya se respondió
            if (respuestasUsuario[num] !== null) {
                const divExplicacion = document.createElement('div');
                divExplicacion.className = 'explicacion';
                divExplicacion.textContent = pregunta.explicacion;
                divExplicacion.style.display = 'block';
                divPregunta.appendChild(divExplicacion);
            }
            
            form.appendChild(divPregunta);
            document.getElementById('pregunta-actual').textContent = num + 1;
            
            // Actualizar el índice
            actualizarIndice();
        }

        // Función para actualizar el índice
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

        // Función para verificar la respuesta seleccionada
        function verificarRespuesta(opcionSeleccionada) {
            const pregunta = preguntas[preguntaActual];
            respuestasUsuario[preguntaActual] = opcionSeleccionada;
            
            if (opcionSeleccionada === pregunta.correcta) {
                respuestasCorrectas++;
            } else if (respuestasUsuario[preguntaActual] !== null && pregunta.correcta === respuestasUsuario[preguntaActual]) {
                // Si antes estaba correcta y ahora no, restamos
                respuestasCorrectas--;
            }
            
            // Actualizar la visualización de las opciones
            mostrarPregunta(preguntaActual);
            
            // Mostrar resultado parcial
            const preguntasRespondidas = respuestasUsuario.filter(r => r !== null).length;
            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.innerHTML = `
                <p>Respuestas correctas: ${respuestasCorrectas} de ${preguntasRespondidas}</p>
                <p>Porcentaje de aciertos: ${preguntasRespondidas > 0 ? ((respuestasCorrectas / preguntasRespondidas) * 100).toFixed(1) : 0}%</p>
            `;
            resultadoDiv.style.display = 'block';
            
            // Actualizar controles de navegación
            actualizarControlesNavegacion();
        }

        // Función para actualizar controles de navegación
        function actualizarControlesNavegacion() {
            document.getElementById('anterior-btn').style.display = preguntaActual === 0 ? 'none' : 'block';
            document.getElementById('siguiente-btn').style.display = preguntaActual === preguntas.length - 1 ? 'none' : 'block';
            document.getElementById('finalizar-btn').style.display = preguntaActual === preguntas.length - 1 ? 'block' : 'none';
        }

        // Función para avanzar a la siguiente pregunta
        function siguientePregunta() {
            if (preguntaActual < preguntas.length - 1) {
                preguntaActual++;
                mostrarPregunta(preguntaActual);
                actualizarControlesNavegacion();
            }
        }

        // Función para retroceder a la pregunta anterior
        function anteriorPregunta() {
            if (preguntaActual > 0) {
                preguntaActual--;
                mostrarPregunta(preguntaActual);
                actualizarControlesNavegacion();
            }
        }

        // Función para finalizar el test
        function finalizarTest() {
    const preguntasRespondidas = respuestasUsuario.filter(r => r !== null).length;
    const resultadoFinal = `
        <h3>Test completado</h3>
        <p>Has respondido ${preguntasRespondidas} de ${preguntas.length} preguntas.</p>
        <p>Respuestas correctas: ${respuestasCorrectas} (${preguntasRespondidas > 0 ? ((respuestasCorrectas / preguntasRespondidas) * 100).toFixed(1) : 0}%)</p>
        <p>Respuestas incorrectas: ${preguntasRespondidas - respuestasCorrectas}</p>
        <p>Preguntas sin responder: ${preguntas.length - preguntasRespondidas}</p>
    `;
    document.getElementById('resultado').innerHTML = resultadoFinal;

    // Mostrar el botón solo si hay incorrectas o sin contestar
    const hayIncorrectasOSinContestar = preguntas.some((pregunta, index) =>
        respuestasUsuario[index] === null || respuestasUsuario[index] !== pregunta.correcta
    );
    document.getElementById('reintentar-incorrectas-btn').style.display = hayIncorrectasOSinContestar ? 'block' : 'none';
}

        
        function reintentarIncorrectas() {
    const preguntasIncorrectas = preguntas
        .map((pregunta, index) => ({ ...pregunta, indexOriginal: index }))
        .filter((_, index) => respuestasUsuario[index] === null || respuestasUsuario[index] !== preguntas[index].correcta);
            
            

    if (preguntasIncorrectas.length === 0) {
        alert('No has fallado ninguna pregunta.');
        return;
    }

    preguntasIncorrectas.forEach(p => {
        // Desordenar las opciones
        const opcionesOriginales = [...p.opciones];
        const correctaOriginal = p.opciones[p.correcta];

        // Mezclar opciones
        for (let i = opcionesOriginales.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opcionesOriginales[i], opcionesOriginales[j]] = [opcionesOriginales[j], opcionesOriginales[i]];
        }

        p.opciones = opcionesOriginales;
        p.correcta = opcionesOriginales.indexOf(correctaOriginal);
    });

    // Reiniciar variables con solo las incorrectas
    preguntaActual = 0;
    respuestasCorrectas = 0;
    respuestasUsuario = Array(preguntasIncorrectas.length).fill(null);
    preguntas.splice(0, preguntas.length, ...preguntasIncorrectas); // reemplaza el array de preguntas

    // Actualizar interfaz
    document.getElementById('reintentar-incorrectas-btn').style.display = 'none';
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('finalizar-btn').style.display = 'none';

    generarIndice();
    mostrarPregunta(preguntaActual);
    actualizarControlesNavegacion();
            
    
}
// Modo policial
            const toggle = document.getElementById("toggleModo");
            if (localStorage.getItem("modoPolicial") === "true") {
                document.body.classList.add("modo-policial");
                toggle.checked = true;
            }
            toggle.addEventListener("change", () => {
                if (toggle.checked) {
                    document.body.classList.add("modo-policial");
                    localStorage.setItem("modoPolicial", "true");
                } else {
                    document.body.classList.remove("modo-policial");
                    localStorage.setItem("modoPolicial", "false");
                }
            });

            