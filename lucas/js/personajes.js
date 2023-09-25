// Definir la página actual y la cantidad de personajes por página
let paginaActual = 1;
const personajesPorPagina = 16;

// Función para cargar los personajes desde la API
async function cargarPersonajes() {
    try {
        // Obtener datos de la API
        const respuesta = await fetch(`https://rickandmortyapi.com/api/character?page=${paginaActual}`);
        const { results } = await respuesta.json();

        // Obtener el contenedor de personajes en el documento HTML
        const contenedorPersonajes = document.getElementById('contenedor-personajes');
        contenedorPersonajes.innerHTML = '';

        // Iterar a través de los resultados y crear tarjetas para cada personaje
        results.forEach((personaje) => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'col mb-4';
            tarjeta.innerHTML = `
                <div class="card">
                    <img src="${personaje.image}" class="card-img-top" alt="${personaje.name}">
                    <div class="card-body">
                        <h5 class="card-title">${personaje.name}</h5>
                        <p class="card-text">Estado: ${personaje.status}</p>
                        <p class="card-text">Especie: ${personaje.species}</p>
                        <p class="card-text">Género: ${personaje.gender}</p>
                        <button class="btn btn-primary" onclick="mostrarUbicacion('${personaje.location.url}')">Ver Ubicación</button>
                    </div>
                </div>
            `;
            contenedorPersonajes.appendChild(tarjeta);
        });
    } catch (error) {
        console.error('Error al cargar los personajes:', error);
    }
}

// Función para crear los botones de paginación
async function crearBotonesPaginacion() {
    try {
        // Obtener el contenedor de paginación en el documento HTML
        const contenedorPaginacion = document.getElementById('paginacion');

        // Crear botones de paginación para las primeras 5 páginas
        for (let i = 1; i <= 5; i++) {
            const li = document.createElement('li');
            li.className = 'page-item';
            const boton = document.createElement('button');
            boton.className = 'page-link';
            boton.textContent = i;
            boton.addEventListener('click', () => {
                paginaActual = i;
                cargarPersonajes();
            });
            li.appendChild(boton);
            contenedorPaginacion.appendChild(li);
        }
    } catch (error) {
        console.error('Error al obtener el número total de páginas:', error);
    }
}

// Función para mostrar la ubicación de un personaje
async function mostrarUbicacion(url) {
    try {
        // Obtener datos de ubicación desde la API
        const respuesta = await fetch(url);
        const ubicacion = await respuesta.json();

        // Obtener elementos del modal en el documento HTML
        const modalElement = document.getElementById('ubicacionModal');
        const ubicacionNombre = document.getElementById('ubicacionNombre');
        const ubicacionTipo = document.getElementById('ubicacionTipo');
        const ubicacionDimension = document.getElementById('ubicacionDimension');

        // Asignar los datos de ubicación a los elementos del modal
        ubicacionNombre.textContent = ubicacion.name;
        ubicacionTipo.textContent = ubicacion.type;
        ubicacionDimension.textContent = ubicacion.dimension;

        // Mostrar el modal configurando su estilo
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        modalElement.style.background = 'rgba(0, 0, 0, 0.5)';

        // Agregar evento de clic al botón "X" de cerrar
        const cerrarModalButton = document.getElementById('cerrarModal');
        cerrarModalButton.addEventListener('click', () => {
            modalElement.style.display = 'none';
            modalElement.classList.remove('show');
        });
    } catch (error) {
        console.error('Error al cargar la ubicación:', error);
    }
}

// Cargar los botones de paginación y los personajes al cargar la página
window.addEventListener('load', () => {
    crearBotonesPaginacion();
    cargarPersonajes();
});