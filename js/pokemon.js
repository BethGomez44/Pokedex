
/**
 * Constantes a utilizar
 * */
const maximaPokemons = 210;
const pantallaContenido = document.querySelector(".pantalla-contenido");
const busqueda = document.querySelector("#buscador");
const errorBusqueda = document.querySelector("#busqueda-fallida")

let todosPokemon = [];

/**
 * Obtenemos la información de los pokemones mediante una solicitud GET con un fetch a la API Pokéapi,
 * si fue aprobada la solicitud, la respuesta se convierte en un json llamado data
 */
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maximaPokemons}`).then((res) => res.json()).then((data) => {
    todosPokemon = data.results;
    mostrarPokemons(todosPokemon);
});

/**
 * 
 */
async function manejoPokemonData(id) {
    try {
        const [pokemon, especiePokemon] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).
                then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).
                then((res) => res.json()),
        ]);
        return true;
    } catch (e) {
        console.error("Error en el fetch");
    }
}

/**
 * Empezamos a formar la estructura de las tarjetas en base a la información recuperada en la solicitud
 */
function mostrarPokemons(pokemon) {
    pantallaContenido.innerHTML = "";
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const tarjeta = document.createElement("div");
        // Se construye la estructura de las tarjetas que se van a crear
        tarjeta.className = "pokemon-caja";
        tarjeta.innerHTML = `
            <p class="pokemon-id">#${pokemonID}</p>
            <div class="imagen-tarjeta">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" 
                alt="${pokemon.name}" class="pokemon-img"/>
            </div>
            <p class="pokemon-nombre">${pokemon.name}</p>
        `;
        tarjeta.addEventListener("click", async () => {
            const completado = await manejoPokemonData(pokemonID);
            if (completado) {
                // window.location.href = `./detail.html?id=${pokemonID}`;
                detallesPokemon(pokemon);
            }
        });
        pantallaContenido.appendChild(tarjeta);
    });
}

busqueda.addEventListener("keyup", manejadorBusqueda);

/**
 * Función que se encargará de filtrar la busqueda mediante el nombre del pokémon
 */
function manejadorBusqueda() {
    const terminoBusqueda = buscador.value.toLowerCase();
    let filtrado;
    if (terminoBusqueda == '') {
        filtrado = todosPokemon;
    } else {
        filtrado = todosPokemon.filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(terminoBusqueda);
        });
    }
    //Se muestra el resultado de la condición anterior
    mostrarPokemons(filtrado);
    //En dado caso que ningún nombre coincida, se mostrará un aviso al usuario
    if (filtrado.length === 0){
        const busquedaFallida = document.createElement("h2");
        busquedaFallida.id = "busqueda-fallida"
        busquedaFallida.innerHTML = `Sin resultados para <br>"${terminoBusqueda}"`;
        pantallaContenido.style.display = "Block";
        pantallaContenido.appendChild(busquedaFallida);
    }else {
        pantallaContenido.style.display = "grid";
    }
}

/**
 * Función que nos creará el contenido de información acerca de un pokemon cuando demos click en él
 * @param {*} pokemon - data a manejar 
 */
function detallesPokemon(pokemon){
    const pokemonID = pokemon.url.split("/")[6];
    const detalles = document.createElement("div");
    pantallaContenido.style.display = "Block";
    pantallaContenido.innerHTML = `
    <div id="caja-regresar">
        <img src= "./images/back.svg" id="boton-regresar"> </img>
        <img class="imagen-stats" src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"
    </div>
    <div class="stats">
        <ul class="nombre-stats">
            <li id="stats-id"><p class="pokemon-id">#${pokemonID}</p></li>
            <li id="stats-nombre"><p class="pokemon-nombre">${pokemon.name}</p></li>
        </ul>
    </div>`;
    pantallaContenido.appendChild(detalles);
    
    const regresar = document.querySelector("#boton-regresar");
    regresar.addEventListener("click", () => {
        manejadorBusqueda();
    });
}