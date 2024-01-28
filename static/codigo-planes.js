var i = 0;
var respuesta_peticion;
var ultimo_alimento_val = {
    calories: 23.8,
    carbohydrates_total_g: 1.8,
    cholesterol_mg: 5,
    fat_saturated_g: 0.5,
    fat_total_g: 1.2,
    fiber_g: 0,
    name: "burger",
    potassium_mg: 13,
    protein_g: 1.5,
    serving_size_g: 10,
    sodium_mg: 35,
    sugar_g: 0
}; // diccionario por defecto al cargar pagina
var lista_alimentos = [];
// Utilizo formular BMR  con el ultimo registro dado para sacar el las calorías necesarias:
// Si no hay registro lo dejo en 0 el max de calorías
var max_cal = (localStorage.length>=1) ? Math.round((JSON.parse(localStorage[localStorage.length-1])["peso"]*10+6.26*JSON.parse(localStorage[localStorage.length-1])["altura"]-5*JSON.parse(localStorage[localStorage.length-1])["edad"]+10)*1.2) : 0;
var cal_actuales=1;



function RespuestaPeticion(obj_xmlhttp) {
    if (obj_xmlhttp.readyState === 4 && obj_xmlhttp.status === 200) { // Respuesta correcta no hay errores
        // Lo convierto a objeto js el json
        var respuesta = JSON.parse(obj_xmlhttp.responseText);
        // Lo guardo para que pueda acceder luego
        respuesta_peticion = respuesta;
      }
}

function BuscarAlimentoAPI(str_comida) {
    // Explicado todo como funciona: https://www.w3schools.com/js/js_ajax_http.asp
    let obj_xhr = new XMLHttpRequest() // creo obj xmlhttprequest

    // defino url de la api
    var apiUrl = 'https://api.calorieninjas.com/v1/nutrition?query='+"10g "+str_comida;

    // configuro solicitud, con mi key de la api, url, destino, método etc ...
    obj_xhr.open('GET', apiUrl, true);
    obj_xhr.setRequestHeader('X-Api-Key', "d3yFTyw0O0lGuDig0b67hg==M3K1zE4vbzA45zsi");

    // función de devolución de llamada para manejar la respuesta
    obj_xhr.onreadystatechange = function () { // esto solo se ejecutara cuando tenga las respuesta similar
        RespuestaPeticion(obj_xhr); // a threads en py
    }

    // envió la solicitud
    obj_xhr.send();
}

function BuscarComida() {
    let input_alimento = document.getElementById("buscador-comida");

    if (isNaN(Number(input_alimento.value)) && input_alimento.value.trim().length>1) { // verificó que es string y que no tiene espacio
        BuscarAlimentoAPI(input_alimento.value);
        setTimeout(function() { // hago un timeout de medio segundo porque la respuesta no va ser inmediata
            console.log(respuesta_peticion); 
            CambiarAlimento();
        }, 1000);
    }

}

function CambiarAlimento() {
    let output_buscador = document.getElementById("output-buscador");
    let span_cant = document.getElementById("span-cant-añadir");
    let boton_añadir_alim = document.getElementById("añadir-comida");

    // Si ha encontrado un alimento actualizar textos
    if (respuesta_peticion.items.length>=1) {
        ultimo_alimento_val = respuesta_peticion["items"][0]; // guardo ultimo alimento valido
        output_buscador.innerHTML=`${respuesta_peticion["items"][0]["name"].charAt(0).toUpperCase()+respuesta_peticion["items"][0]["name"].slice(1)} 10g ${respuesta_peticion["items"][0]["calories"]} kcal ${respuesta_peticion["items"][0]["fat_total_g"]}g grasa ${respuesta_peticion["items"][0]["carbohydrates_total_g"]}g carbohidratos ${respuesta_peticion["items"][0]["sugar_g"]}g azucar ${respuesta_peticion["items"][0]["protein_g"]}g proteína`;
    }
}

function ActualizarTabAlimentos() {
    let tabla = document.getElementById("tabla-comida");

    tabla.innerHTML="<tr><th>Nombre alimento</th><th>Cantidad comida</th><th>Calories</th><th>Total grasas</th><th>Carbohidratos</th><th>Azucares</th><th>Proteínas</th></tr>";
    for (let i=0; i<=lista_alimentos.length-1; i++) {
        tabla.innerHTML+=`<tr><td>${lista_alimentos[i]["name"]}</td><td>${lista_alimentos[i]["grams"]}</td><td>${lista_alimentos[i]["calories"]}</td><td>${lista_alimentos[i]["fats"]}</td><td>${lista_alimentos[i]["carbohydrates"]}</td><td>${lista_alimentos[i]["sugars"]}</td><td>${lista_alimentos[i]["protein"]}</td></tr>`
    }
}

function InsertarAlimentoList() {
    let input_cant_añadir = document.getElementById("cant-input");
    console.log(ultimo_alimento_val["calories"]*input_cant_añadir.value)
    if ((ultimo_alimento_val["calories"]*input_cant_añadir.value)+cal_actuales <= max_cal && input_cant_añadir.value>=1) {
        lista_alimentos.unshift({ // Añado alimento a lista alimentos * cantidad seleccionada
            name: ultimo_alimento_val["name"].charAt(0).toUpperCase()+ultimo_alimento_val["name"].slice(1),
            grams: 10*input_cant_añadir.value + "g",
            calories: (ultimo_alimento_val["fat_total_g"]*10),
            fats: (ultimo_alimento_val["fat_total_g"] * input_cant_añadir.value).toFixed(1) + "g",
            carbohydrates: (ultimo_alimento_val["carbohydrates_total_g"] * input_cant_añadir.value).toFixed(2) + "g",
            sugars: (ultimo_alimento_val["sugar_g"] * input_cant_añadir.value).toFixed(1) + "g",
            protein: (ultimo_alimento_val["protein_g"] * input_cant_añadir.value).toFixed(1) + "g"
          }); // añado alimento al principio de lista

        // Añado calorías
        cal_actuales += ultimo_alimento_val["calories"]*input_cant_añadir.value;

        // Actualizo pantalla tabla
        ActualizarTabAlimentos();
        ActualizarProgreso();
    } else {
        alert("¡You can't add this cause it will be more than your allowed calorie intake!");
    }
}

function ActualizarProgreso() {
    let cal_maximas_h1 = document.getElementById("calorias-maximas");
    let porcentaje_h2 = document.getElementById("porcentaje-completo");

    let porcentaje_cerc = (1-Math.abs((cal_actuales-max_cal)/max_cal))*100; // https://www.statisticshowto.com/relative-error/
    porcentaje_cerc = Math.max(porcentaje_cerc, 0);
    porcentaje_cerc = Math.round(porcentaje_cerc, 2);

    // Actualizo porcentaje h2
    porcentaje_h2.innerHTML=porcentaje_cerc+"%";
    // Actualizo h1 calorías objetivo
    cal_maximas_h1.innerHTML="Goal calories: "+max_cal;
    // Actualizo barra porcentaje
    document.getElementById("barra").style.width=porcentaje_cerc.toString()+"%";

}

ActualizarProgreso();

