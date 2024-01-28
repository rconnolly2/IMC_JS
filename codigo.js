var tipo_sistema_seleccionado = "metrico";
var clasificacion_peso = {
    0: "Peso bajo",
    1: "Normal",
    2: "Sobrepeso",
    3: "Obesidad 1",
    4: "Obesidad 2",
    5: "Obesidad 3",
    6: "Obesidad 4"
};

let edad = document.getElementById("edad");
let lista_generos = document.getElementsByName("genero");
let altura_metrico = document.getElementById("altura-input");
let altura_imperial_pies = document.getElementById("pies-input");
let altura_imperial_pulgadas = document.getElementById("pulgadas-input");
let peso_metrico = document.getElementById("peso-input");
let peso_imperial = document.getElementById("libras-input");
// Sexo
let lista_radios = document.getElementsByName("genero");

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

/**
 * Esta función simplemente valida datos en caso de no ser validos da un alert y
 * elimina EL CAMPO
 */
function ValidarDatos(obj_html) {
    if (isNaN(Number(obj_html.value)) || Number(obj_html.value==0)) {
            alert("Error: ¡datos no validos!");
            obj_html.value="";
    }
}

function ImprimirResultado(imc, clasi_peso, sexo) {
    let output_imc = document.getElementById("output-imc");
    let resultado_peso = document.getElementById("resultado-peso");
    let imagen_peso = document.getElementById("imagen-peso");

    // Cambio texto:
    output_imc.innerHTML=`IMC=${imc}`;
    resultado_peso.innerHTML=`(${clasificacion_peso[clasi_peso]})`;

    // Cambio color si es negativo o positivo:
    if (clasi_peso<1 || clasi_peso>1) {
        resultado_peso.style.color="red";
    } else {
        resultado_peso.style.color="green";
    }

    // Cambio imagen peso + sexo
    imagen_peso.src = `/img/${clasi_peso+sexo.toLowerCase()}.png`;
}

function CalcularIMC(altura_total, peso_final) {
    let imc;

    if (tipo_sistema_seleccionado=="metrico") {
        imc = (peso_final/Math.pow(altura_total/100, 2)).toFixed(1); // 1 decimal solo
        return imc;
    } else {
        imc = ((peso_final / Math.pow(altura_total, 2)) * 703).toFixed(1);
        return imc;
    }

}

function ClasificarIMC(imc) {
    if (imc<18.5) {
        return 0;
    } else if (imc>=18.5 && imc<25) {
        return 1;
    } else if (imc>=25 && imc<30) {
        return 2;
    } else if (imc>=30 && imc<35) {
        return 3;
    } else if (imc>=35 && imc<40) {
        return 4;
    } else if (imc>=40 && imc<50) {
        return 5;
    } else if (imc>=50) {
        return 6;
    }
}

function ClickCalcular() {
    // Datos en int para asegurarme que es un numero ...
    let edad_int = parseInt(edad.value);
    let altura_metrico_int = parseInt(altura_metrico.value);
    let peso_metrico_int = parseInt(peso_metrico.value);
    let peso_imperial_int = parseInt(peso_imperial.value);
    let altura_imperial_pies_int = parseInt(altura_imperial_pies.value);
    let altura_imperial_pulgadas_int = parseInt(altura_imperial_pulgadas.value);
    // Sexo
    let sexo_seleccionado;

    for (var i=0; i<lista_radios.length; i++) { // Saco genero seleccionado
        if (lista_radios[i].checked) {
            sexo_seleccionado = i; // guardo val iterador para saber que sexo es seleccionado o ninguno
            break;
        }
    }

    // Primero compruebo si usuario a seleccionado genero sino lanzo error:
    if (typeof sexo_seleccionado == "undefined") {
        alert("¡No has seleccionado un genero!");
        edad.value = 0;
        altura_metrico.value = 0;
        peso_metrico.value = 0;
        throw new Error("Error: Usuario no a seleccionado un genero");
    }
    sexo_seleccionado = (sexo_seleccionado==0) ? "Hombre" : "Mujer"; // convierto en str

    if (tipo_sistema_seleccionado === "metrico") { // Si estamos en modo metrico
        // Verifico que esta entre mis mínimos y máximos posibles
        if (edad_int >= 7 && edad_int <= 120 && altura_metrico_int >= 54 && altura_metrico_int <= 272 && peso_metrico_int >= 27 && peso_metrico_int <= 635) {
            let imc = CalcularIMC(altura_metrico_int, peso_metrico_int);
            let clasi_imc = ClasificarIMC(imc);
            ImprimirResultado(imc, clasi_imc, sexo_seleccionado);

            // Guardo datos en memoria
            let obj_date = new Date();
            GuardarDatos(`${obj_date.getDate()+1}/${obj_date.getMonth()+1}`, `${obj_date.getHours()}:${obj_date.getMinutes()}`, edad_int, sexo_seleccionado, altura_metrico_int, peso_metrico_int, imc, clasi_imc);
            ImprimirDatosMemoria();
        } else {
            alert("¡Datos no válidos! No están en el rango indicado"); // no son validos reseteo y levanto error
            edad.value = 0;
            altura_metrico.value = 0;
            peso_metrico.value = 0;
            throw new Error("¡Datos no válidos! No están en el rango indicado"); // Levanto error
        }
    } else { // sistema imperial
        let altura_total_imp;
        if (isNaN(altura_imperial_pies_int) || isNaN(altura_imperial_pulgadas_int)) { // Si un campo pies o pulgadas esta vació:
            // Cojo el que no este vació y sera mi altura total
            altura_total_imp = isNaN(altura_imperial_pies_int) ? altura_imperial_pulgadas_int : altura_imperial_pies_int*12;
        } else {
            // Si están los dos campos, convierto a pulgadas y los sumo
            altura_total_imp = altura_imperial_pies_int*12+altura_imperial_pulgadas_int;
        }
        // Verifico que esta entre mis mínimos y máximos posibles
        if (edad_int >= 7 && edad_int <= 120 && altura_total_imp >= 21 && altura_total_imp <= 107 && peso_imperial_int >= 59 && peso_imperial_int <= 1399) {
            let imc = CalcularIMC(altura_total_imp, peso_imperial_int);
            let clasi_imc = ClasificarIMC(imc);
            ImprimirResultado(imc, clasi_imc, sexo_seleccionado);

            // Guardo datos en memoria
            let obj_date = new Date();
            GuardarDatos(`${obj_date.getDate()+1}/${obj_date.getMonth()+1}`, `${obj_date.getHours()}:${obj_date.getMinutes()}`, edad_int, sexo_seleccionado, altura_total_imp*2.54, Math.round(peso_imperial_int/2,205), imc, clasi_imc);
            ImprimirDatosMemoria();
        } else {
            alert("¡Datos no válidos! No están en el rango indicado");
            edad.value = 0;
            altura_imperial_pulgadas.value = 0;
            altura_imperial_pies.value = 0;
            peso_imperial.value = 0;
            throw new Error("¡Datos no válidos! No están en el rango indicado"); // Levanto error
        }
    }
}

function GuardarDatos(fecha, hora, edad, genero, altura, peso, imc, resultado) {
    localStorage.setItem(localStorage.length.toString(), JSON.stringify(new Registro(fecha, hora, edad, genero, altura, peso, imc, clasificacion_peso[resultado])));
}

function ImprimirDatosMemoria() {
    let tabla_html = document.getElementById("historial-registros");

    tabla_html.innerHTML="<tr><th>Fecha</th><th>Hora</th><th>Edad</th><th>Genero</th><th>Altura</th><th>Peso</th><th>IMC</th><th>Resultado</th></tr>"
    for (let i=0; i<=localStorage.length-1; i++) {
        let obj_registro = localStorage.getItem(i.toString());
        obj_registro = JSON.parse(obj_registro); // convierto json a obj js
        // Append al inner html añadiendo datos
        tabla_html.innerHTML+=`<tr><td>${obj_registro.fecha}</td><td>${obj_registro.hora}</td><td>${obj_registro.edad}</td><td>${obj_registro.genero}</td><td>${obj_registro.altura}</td><td>${obj_registro.peso}</td><td>${obj_registro.imc}</td><td>${obj_registro.resultado}</td></tr>`
    }
}




// Código que se ejecuta al cargar pagina:
ImprimirDatosMemoria()