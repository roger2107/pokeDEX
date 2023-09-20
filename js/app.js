 //Elementos HTML
const listaPokemon = document.querySelector('#lista-pokemon');
var select = document.getElementById("generacion");

//VARIABLES DEL MODAL
let modal = document.querySelector('#modal');
//let modalContainer = document.querySelector('.modal__container');
let imagenModal =  document.querySelector('.modal__img');
let parrafoDescripcion  = document.getElementById('modal__paragraph');
let tituloModal = document.querySelector('.modal__title');
let cerrarModal = document.querySelector('.modal__close');
let contenedorTipoModal = document.querySelector('.contenedor-tipos--modal');
let contenedorImagen = document.querySelector('.contenedor-imagen');
let tipoPrincipal;



//URLS
let URL = "https://pokeapi.co/api/v2/pokemon/";
let URLdescripcion = "https://pokeapi.co/api/v2/pokemon-species/"

//VARIABLES
let descripciones=[];
let inicioPokemon;
let limitePokemon;
let gen = [
            {inicio: 1,fin:905},
            {inicio: 1,fin: 151}, 
            {inicio: 152,fin: 251},
            {inicio: 252,fin: 386},
            {inicio: 387,fin: 493},
            {inicio: 494,fin: 649},
            {inicio: 650,fin: 721},
            {inicio: 722,fin: 809},
            {inicio: 810,fin: 905}
        ];



select.addEventListener("change", function() {
    // Obtiene el valor seleccionado
    var valorSeleccionado = select.value;

    listaPokemon.innerHTML = '';
    // Muestra el valor en un cuadro de alerta
    //alert("Valor seleccionado: " + valorSeleccionado);
    inicioPokemon = gen[valorSeleccionado].inicio;
    limitePokemon = gen[valorSeleccionado].fin;
    buscarPokemon();
});



/*
            // SOLICITUDES A LA API
*/

//Solicita los datos generales los pokemon
function buscarPokemon(){
    for(let i=inicioPokemon; i<=limitePokemon; i++){
        fetch(URL+i)
            .then((response) => response.json())
            .then(data => mostrarPokemon(data))
    }
}

//Solicita los datos de las entradas del Pokedex ... flavor_text_entries
function obtenerEntradasPokemon(idPokemon){
    fetch(URLdescripcion+idPokemon)
        .then((response) => response.json())
        .then(data => convertirEntradasEnArreglo(data))
        //.then(data => console.log(data))
        
}

function obtenerDatos(idPokemon){
    let entry = '';
    let entradasEspanol =[];
    fetch(URLdescripcion+idPokemon)
    .then(function(response) {
        // Aquí se maneja la respuesta
        if (!response.ok) {
        throw new Error('Error de red');
        }
        return response.json(); // Devuelve una promesa que resuelve el cuerpo de la respuesta como JSON
    })
    .then(function(data) {
        // Aquí puedes usar los datos
        //console.log(data);
        const claves = Object.keys(data);
        //console.log(claves[6]);
        let llaveEntradas= claves[6];

        //OBTENEMOS EL ARREGLO CON TODAS LAS ENTRADAS DEL POKEMON
        let arregloEntradas = data[llaveEntradas]
        //console.log(arregloEntradas[0]);

        arregloEntradas.map((entrada) => {
            //let clavesEntrada = Object.keys(entrada);
            //console.log(clavesEntrada)
            if(entrada.language.name  == "es"){
                //console.log(entrada);
                let entry = '' + entrada.flavor_text;
                entry = entry.replace('\n', ' ');
                entradasEspanol.push(entry);
                //entradasEspanol.push(entrada.flavor_text);
            }
            
        })
        entry = entradasEspanol[0];

    })
    .catch(function(error) {
        // Manejo de errores
        console.error('Error:', error);
    });
    //console.log(typeof(entradasEspanol));
    return entradasEspanol;
    
}



/*
            //Funciones generales
*/

//Muestra en el documento HTML los datos de los pokemon
function mostrarPokemon(pokemon){
    const div = document.createElement('div');
    

   
    
    let tipos = pokemon.types.map((tipo) => 
    
        `
            <div class = "types_detail">
                <img class=" pokemon-card__type" src = "img/types/${tipo.type.name}.png">
                <h4 class="nombre_tipo texto-suave">${tipo.type.name}</h4>
            </div>
        `);

    tipos = tipos.join('');
    div.classList.add('pokemon-card');
    div.id = 'card_'+pokemon.id;
    
    div.innerHTML = `
        <img  class = "pokemon-card__img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png"}"></img>
        <div class="contenedor-titulo ">
            <h3 class="pokemon-card__id ${pokemon.types[0].type.name}" >${pokemon.id} </h3>
            <h3 class="pokemon-card__nombre ${pokemon.types[0].type.name}" id="nombre_${pokemon.id}">${pokemon.name} </h3>
        </div>
        <div class = "contenedor-tipos" id="contenedor-tipos--${pokemon.id}">
            ${tipos}
        </div>
        <p class="pokemon-card__descripcion" id="desc_${pokemon.id}"> </p>
        <button id = "${pokemon.id}" class = "btn_info ${pokemon.types[0].type.name}">Más Info</button>
        `;
        
    listaPokemon.append(div);  

    /**
     * FUNCINALIDAD DEL MODAL
     */
    let boton = document.getElementById(pokemon.id);
        boton.addEventListener("click", function(e){
            console.log("clic en boton: " + this.id)
            parrafoDescripcion.classList.add('texto-suave');
            tituloModal.classList.add('texto-suave');
            ///
            //let entry = '';
            let entradasEspanol =[];
            //fetch(URLdescripcion+pokemon.id)
            fetch(URLdescripcion+this.id)
            .then(function(response) {
                // Aquí se maneja la respuesta
                if (!response.ok) {
                throw new Error('Error de red');
                }
                return response.json(); // Devuelve una promesa que resuelve el cuerpo de la respuesta como JSON
            })
            .then(function(data) {
                // Aquí puedes usar los datos
                //console.log(data);
                const claves = Object.keys(data);
                //console.log(claves[6]);
                let llaveEntradas= claves[6];

                //OBTENEMOS EL ARREGLO CON TODAS LAS ENTRADAS DEL POKEMON
                let arregloEntradas = data[llaveEntradas]
                //console.log(arregloEntradas[0]);

                arregloEntradas.map((entrada) => {
                    //let clavesEntrada = Object.keys(entrada);
                    //console.log(clavesEntrada)
                    if(entrada.language.name  == "es"){
                        //console.log(entrada);
                        let entry = '' + entrada.flavor_text;
                        entry = entry.replace('\n', ' ');
                        entradasEspanol.push(entry);
                        entradasEspanol.push(entrada.flavor_text);
                        parrafoDescripcion.innerHTML = '' + entry;
                        
                    }
                    
                })

            })
            .catch(function(error) {
                // Manejo de errores
                console.error('Error:', error);
            });
            tipoPrincipal = document.getElementById('card_'+this.id).childNodes[5].childNodes[1].childNodes[3].textContent
            console.log('tipo principal: ' + tipoPrincipal);
            
            contenedorImagen.classList.add(tipoPrincipal);
            

            let h2Nombre = document.getElementById('nombre_'+this.id).textContent;
            let rutaImagen = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'+this.id+'.png'
            imagenModal.src = rutaImagen;

            let nombrePokemon = h2Nombre.toUpperCase();
            tituloModal.textContent= nombrePokemon;

            contenedorTipoModal.innerHTML = `${tipos}`;
           
            modal.classList.add('modal--show');
        })
}





cerrarModal.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.classList.remove('modal--show');
    let modalP = document.getElementById('modal__paragraph');
    modalP.textContent = '...';
    contenedorImagen.classList.remove(tipoPrincipal);
})

/**
 function mostrarPokemon(pokemon){
    const div = document.createElement('div');
    let botones;
    let tipos = pokemon.types.map((tipo) => 
    
        `
        <img class="pokemon-card__type" src = "img/types/${tipo.type.name}.png">
        `);

    tipos = tipos.join('');
    div.classList.add('pokemon-card');
    
    div.innerHTML = `
        <img class = "pokemon-card__img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png"}"></img>
        <div class="contenedor-titulo">
            <h3 class="pokemon-card__id">${pokemon.id} </h3>
            <h3 class="pokemon-card__nombre">${pokemon.name} </h3>
        </div>
        <div class = "contenedor-tipos">
            ${tipos}
        </div>
        <p class="pokemon-card__descripcion" id="desc_${pokemon.id}"> </p>
        <button id = "${pokemon.id}" class = "btn_info">+</button>
        `;
    listaPokemon.append(div);

    botones = document.querySelectorAll(".btn_info");
    botones.forEach(function(elemento) {
        elemento.addEventListener("click", function(e){
            e.preventDefault();
            let idBoton = this.id;
            let descripcionDex = obtenerDatos(1);
            console.log(descripcionDex);
            parrafoDescripcion.innerHTML = '' + descripcionDex[0];

            modal.classList.add('modal--show');

        })
    });  
}   
 */