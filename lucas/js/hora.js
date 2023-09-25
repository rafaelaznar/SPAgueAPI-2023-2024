// Función para obtener y mostrar la hora actual desde la API de WorldTimeAPI
async function obtenerYMostrarHoraActual() {
    try {
        const respuesta = await fetch('http://worldtimeapi.org/api/timezone/Europe/Madrid');
        if (respuesta.ok) {
            const datos = await respuesta.json();
            const horaActual = document.getElementById('hora-actual');
            const hora = datos.datetime.slice(11, 19); // Obtener solo la hora (formato HH:mm:ss)
            horaActual.textContent = `Hora actual: ${hora}`;
        } else {
            console.error('Error al obtener la hora actual desde la API');
        }
    } catch (error) {
        console.error('Error al obtener la hora actual:', error);
    }
}

// Llamar a la función para obtener y mostrar la hora actual al cargar la página
window.addEventListener('load', () => {
    obtenerYMostrarHoraActual();
    // También puedes actualizar la hora cada segundo si lo deseas
    setInterval(obtenerYMostrarHoraActual, 1000);
});