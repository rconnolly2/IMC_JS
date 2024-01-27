var tipo_sistema_seleccionado = "metrico";

function CambioSistema(obj_html) {
    let lista_elementos = document.querySelectorAll(".boton-sistema, .boton-sistema-click");
    // Sistema imperial:
    // Input sistema imperial
    let pies_input = document.getElementById("pies-input");
    let pulgadas_input = document.getElementById("pulgadas-input");
    let libras_input = document.getElementById("libras-input");
    // Input sistema métrico
    let peso_input = document.getElementById("peso-input");
    let altura_input = document.getElementById("altura-input");

    tipo_sistema_seleccionado = obj_html.getAttribute("sistema"); // selecciono

    for (let i=0; i<=lista_elementos.length-1; i++) {
        if (lista_elementos[i].getAttribute("sistema")==tipo_sistema_seleccionado) {
            lista_elementos[i].classList.remove("boton-sistema");
            lista_elementos[i].classList.add("boton-sistema-click");
        } else {
            lista_elementos[i].classList.add("boton-sistema");
        }
    }

    // escondo y enseño elementos según su sistema
    if (tipo_sistema_seleccionado == "metrico") {
        pies_input.style.display="none";
        pulgadas_input.style.display="none";
        libras_input.style.display="none";

        peso_input.style.display="inline-block";
        altura_input.style.display="inline-block";
    } else {
        peso_input.style.display="none";
        altura_input.style.display="none";

        pies_input.style.display="inline-block";
        pulgadas_input.style.display="inline-block";
        libras_input.style.display="inline-block";
    }
}