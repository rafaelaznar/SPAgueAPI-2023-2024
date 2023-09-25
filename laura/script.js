// Función para cerrar el modal
function cerrarModal() {
    // Se obtiene el modal y se oculta
    const modal = document.getElementById("modalPokemon");
    modal.classList.remove("show");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
}

// Función para cargar y mostrar los Pokémon
async function cargarPagina(pagina) {
    // Se obtienen elementos HTML necesarios
    const listaPokemon = document.getElementById("listaPokemon");
    const detallesPokemon = document.getElementById("detallesPokemon");
    const pokemonImage = document.getElementById("pokemonImage");
    const pokemonInfo = document.getElementById("pokemonInfo");

    // Se calcula el rango de Pokémon a mostrar en esta página
    const pokemonPorPagina = 50;
    const inicio = (pagina - 1) * pokemonPorPagina;
    const fin = inicio + pokemonPorPagina;

    try {
        // Se obtiene la lista de Pokémon desde la API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=250`);
        const data = await response.json();

        // Se limpia la lista de Pokémon actual
        listaPokemon.innerHTML = "";

        // Se itera sobre la lista de Pokémon y se crea una tarjeta para cada uno
        data.results.slice(inicio, fin).forEach(async (pokemon) => {
            const pokemonId = pokemon.url.split("/")[6];

            // Se crea una tarjeta para el Pokémon
            const card = document.createElement("div");
            card.classList.add("col-md-4", "mb-4");

            card.innerHTML = `
                <div class="card">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" class="card-img-top" alt="${pokemon.name}">
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.name}</h5>
                        <button class="btn btn-dark text-white get-pokemon-details" data-id="${pokemonId}">Ver detalles</button>
                    </div>
                </div>
            `;

            // Se agrega un evento clic al botón "Ver detalles"
            const button = card.querySelector(".get-pokemon-details");
            button.addEventListener("click", async () => {
                try {
                    // Se hace una llamada al servidor para obtener los detalles del Pokémon
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                    const data = await response.json();

                    // Se actualiza la imagen del Pokémon y su información en el modal
                    pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                    pokemonImage.alt = data.name;
                    pokemonInfo.innerHTML = `<h1>${data.name}</h1><p>Altura: ${data.height} dm</p><p>Peso: ${data.weight} hg</p>`;

                    // Se muestra el modal
                    const modal = document.getElementById("modalPokemon");
                    modal.classList.add("show");
                    modal.style.display = "block";
                    modal.setAttribute("aria-hidden", "false");
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            // Se agrega la tarjeta a la lista de Pokémon
            listaPokemon.appendChild(card);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Se obtiene el número total de Pokémon
const totalPokemon = 250;

// Se calcula el número de páginas
const pokemonPorPagina = 50;
const numberOfPages = Math.ceil(totalPokemon / pokemonPorPagina);

// Se muestra la página actual
let currentPage = 1;

// Función para generar los botones de paginación
function generarBotonesPaginacion() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    // Se crea un botón para cada página y se maneja el evento clic
    for (let i = 1; i <= numberOfPages; i++) {
        const button = document.createElement("li");
        button.classList.add("page-item");

        const link = document.createElement("a");
        link.href = "#";
        link.classList.add("page-link");
        link.textContent = i;

        if (i === currentPage) {
            button.classList.add("active");
        }

        link.addEventListener("click", () => {
            // Cuando se hace clic en un botón de página, se actualiza la página actual
            currentPage = i;
            cargarPagina(currentPage);

            // Se actualiza la clase "active" en los botones de paginación
            document.querySelectorAll(".pagination .page-item").forEach(pageButton => {
                pageButton.classList.remove("active");
            });
            button.classList.add("active");
        });

        button.appendChild(link);
        pagination.appendChild(button);
    }
}

// Se carga la página inicial y se generan los botones de paginación
cargarPagina(currentPage);
generarBotonesPaginacion();

// Se agrega un evento clic al botón "Cerrar" del modal
const cerrarButton = document.querySelector(".close");
cerrarButton.addEventListener("click", cerrarModal);
