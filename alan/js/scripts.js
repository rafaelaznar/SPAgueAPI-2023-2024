/*!
* Start Bootstrap - Scrolling Nav v5.0.6 (https://startbootstrap.com/template/scrolling-nav)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // COMIENZA CÓDIGO
    // CLASIFICACIÓN
    let listaPilotos = document.getElementById("lista-pilotos");
    let listaConstructores = document.getElementById("lista-constructores");
    let btnPilotos = document.getElementById("btn-pilotos");
    let btnConstructores = document.getElementById("btn-constructores");

    // Función para mostrar la clasificación de pilotos
    function mostrarClasificacionPilotos() {
        listaPilotos.style.display = "block";
        listaConstructores.style.display = "none";
        btnPilotos.classList.add("active");
        btnConstructores.classList.remove("active");

        fetch('https://ergast.com/api/f1/current/driverStandings.json')
            .then(response => response.json())
            .then(data => {
                listaPilotos.innerHTML = "";
                data.MRData.StandingsTable.StandingsLists[0].DriverStandings.forEach(elemento => {
                    let listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.textContent = `${elemento.position} ${elemento.Driver.givenName} ${elemento.Driver.familyName} - Puntos: ${elemento.points}`;
                    listaPilotos.appendChild(listItem);
                });
            });
    }

    // Función para mostrar la clasificación de constructores
    function mostrarClasificacionConstructores() {
        listaPilotos.style.display = "none";
        listaConstructores.style.display = "block";
        btnPilotos.classList.remove("active");
        btnConstructores.classList.add("active");

        fetch('http://ergast.com/api/f1/current/constructorStandings.json')
            .then(response => response.json())
            .then(data => {
                listaConstructores.innerHTML = "";
                data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.forEach(elemento => {
                    let listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.textContent = `${elemento.position} ${elemento.Constructor.name} - Puntos: ${elemento.points}`;
                    listaConstructores.appendChild(listItem);
                });
            });
    }

    // Manejar eventos de clic en los botones
    btnPilotos.addEventListener("click", mostrarClasificacionPilotos);
    btnConstructores.addEventListener("click", mostrarClasificacionConstructores);

    // Mostrar por defecto la clasificación de pilotos
    mostrarClasificacionPilotos();


    // ADIVINA PILOTO
    // Hago esto para poder acceder a sus estadísticas avanzadas desde otra api y no tengo otra manera de conseguir los nombres
    const drivers = ['max-verstappen', 'sergio-perez', 'lewis-hamilton', 'fernando-alonso', 'carlos-sainz', 'charles-leclerc', 'lando-norris', 'george-russell', 'oscar-piastri', 'lance-stroll', 'pierre-gasly', 'esteban-ocon', 'alexander-albon', 'nico-hulkenberg', 'valteri-bottas', 'guanyu-zhou', 'yuki-tsunoda', 'kevin-magnussen', 'liam-lawson', 'logan-sargeant', 'daniel-ricciardo'];

    let elementoImagen = document.getElementById('piloto-icon');
    let pilotoActual = null;
    let imagenPiloto = null;

    // Función para seleccionar un piloto aleatorio
    function selectRandomDriver() {
        pilotoActual = drivers[Math.floor(Math.random() * drivers.length)];
        fetch("https://f1-api.vercel.app/api/drivers/profile/" + pilotoActual)
            .then(response => response.json())
            .then(data => {
                let podiums = data.podiums;
                if (podiums === "N/A") {
                    podiums = 0;
                }
                document.getElementById("podiums").textContent = podiums;
                document.getElementById("num-carreras").textContent = data['grands-prix-entered'];
                document.getElementById("nacionalidad").textContent = data.country;
                document.getElementById("fecha-nacimiento").textContent = data['date-of-birth'];
                imagenPiloto = data.image;
            });
    }

    // Función para manejar la adivinanza
    function checkGuess() {
        const userGuess = document.getElementById("guessInput").value.trim().toLowerCase();
        let piloto = pilotoActual.replace(/-/g, ' ');
        let nombreSeparado = piloto.split(' ');
        piloto = nombreSeparado.map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ');

        const mensajeElement = document.getElementById("mensaje");

        if (userGuess === pilotoActual.replace(/-/g, ' ')) {
            mensajeElement.textContent = "Correcto! Has adivinado el piloto!";
            mensajeElement.classList.add("correcto");
            mensajeElement.classList.remove("incorrecto");
        } else {
            mensaje.textContent = "Incorrecto! Era " + piloto;
            mensajeElement.classList.add("incorrecto");
            mensajeElement.classList.remove("correcto");
        }
        elementoImagen.src = imagenPiloto;
        document.getElementById('nombre-piloto').textContent = piloto;
    }

    // Función para reiniciar el juego
    function resetGame() {
        document.getElementById("guessInput").value = "";
        document.getElementById("mensaje").textContent = "";
        document.getElementById('nombre-piloto').textContent = "";
        elementoImagen.src = "assets/piloto-desconocido.png";
        selectRandomDriver();
    }

    // Manejar eventos de clic
    document.getElementById("guessButton").addEventListener("click", checkGuess);
    document.getElementById("resetButton").addEventListener("click", resetGame);

    // Iniciar el juego seleccionando un piloto aleatorio
    selectRandomDriver();


    // FECHA PROXIMA CARRERA
    const fechaActual = new Date();

    let circuito = null;
    let ciudad = null;
    let pais = null;
    let fechaProximaCarrera = null;
    let carreraEncontrada = false;
    let segundosProximaCarrera = document.getElementById('segundos');
    let minutosProximaCarrera = document.getElementById('minutos');
    let horasProximaCarrera = document.getElementById('horas');
    let diasProximaCarrera = document.getElementById('dias');
    let circuitoProximaCarrera = document.getElementById('circuito');
    let ciudadProximaCarrera = document.getElementById('ciudad');
    let paisProximaCarrera = document.getElementById('pais');

    // función para actualizar la cuenta regresiva
    function actualizarCuentaRegresiva() {
        if (fechaProximaCarrera) {
            const fechaActual = new Date();
            const fechaProxima = new Date(fechaProximaCarrera);
            const diferencia = fechaProxima - fechaActual;

            const segundosRestantes = Math.floor((diferencia / 1000) % 60);
            const minutosRestantes = Math.floor((diferencia / (1000 * 60)) % 60);
            const horasRestantes = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
            const diasRestantes = Math.floor(diferencia / (1000 * 60 * 60 * 24));

            diasProximaCarrera.textContent = diasRestantes;
            horasProximaCarrera.textContent = horasRestantes;
            minutosProximaCarrera.textContent = minutosRestantes;
            segundosProximaCarrera.textContent = segundosRestantes;

            circuitoProximaCarrera.textContent = circuito;
            ciudadProximaCarrera.textContent = ciudad;
            paisProximaCarrera.textContent = pais;
        }
    }

    // Calendario de carreras
    fetch('https://ergast.com/api/f1/current.json')
        .then(response => response.json())
        .then(data => {
            data.MRData.RaceTable.Races.forEach(elemento => {
                let fechaCarrera = `${elemento.date}T${elemento.time}`
                if (!carreraEncontrada && fechaCarrera >= fechaActual.toISOString()) {
                    fechaProximaCarrera = elemento.date;
                    circuito = elemento.Circuit.circuitName;
                    ciudad = elemento.Circuit.Location.locality;
                    pais = elemento.Circuit.Location.country
                    carreraEncontrada = true;
                }
            });
            checkClima(ciudad);
            setInterval(actualizarCuentaRegresiva, 1000);
        });


    // PARTE DE LA API DEL CLIMA
    async function checkClima(ciudad) {
        const apiKey = "d4fd00b94a3331b7e1544d920b44908d";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${ciudad}`;
        const weatherIcon = document.querySelector(".weather-icon");

        const response = await fetch(apiUrl + `&appid=${apiKey}`);
        let data = await response.json();

        document.querySelector(".city").innerHTML = ciudad;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if (data.weather[0].main === 'Clouds') {
            weatherIcon.src = "assets/clouds.png";
        } else if (data.weather[0].main === 'Clear') {
            weatherIcon.src = "assets/clear.png";
        } else if (data.weather[0].main === 'Rain') {
            weatherIcon.src = "assets/rain.png";
        } else if (data.weather[0].main === 'Drizzle') {
            weatherIcon.src = "assets/drizzle.png";
        } else if (data.weather[0].main === 'Mist') {
            weatherIcon.src = "assets/mist.png";
        } else if (data.weather[0].main === 'Snow') {
            weatherIcon.src = "assets/snow.png"
        }
    }
});
