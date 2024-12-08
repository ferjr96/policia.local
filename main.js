
        window.onload = function () {
            // Encuentra todos los elementos con id="correct" y les asigna un nuevo ID
            var elements = document.querySelectorAll('[id="correct"]');
            elements.forEach(function (el, index) {
                el.id = 'color' + String(index).padStart(3, '0');
            });

            // Encuentra todos los botones y les asigna un evento onclick
            var buttons = document.querySelectorAll('button');
            buttons.forEach(function (button, index) {
                button.onclick = function () {
                    cambiarColor(index)
                };
            });
        };

    function cambiarColor(index) {
        // Color fijo (verde)
        var color = '#1CFF00';

        // Obtiene el elemento con el ID correspondiente y cambia su color
        var elemento = document.getElementById('color' + String(index).padStart(3, '0'));
        if (elemento) {
            elemento.style.backgroundColor = color;
        };
    };





    // Cambiar Mostrar ocultar solucion
    function myFunction() {
        var x = document.getElementById("myDIV");
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
        };
    };

