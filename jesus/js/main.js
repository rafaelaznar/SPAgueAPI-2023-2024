const Categories = {
    EQUIPMENTS: 'equipment',
    MONSTERS: 'monsters',
    MATERIALS: 'materials',
    CREATURES: 'creatures',
};

// Variables globales
const cardsPerPage = 12;
let currentPage = 1;
let data;
let choosedCategory = Categories.MONSTERS;


// Función para obtener datos de una categoría y mostrar tarjetas según la página actual
function obtainDataAndShow(category) {
    const url = `https://botw-compendium.herokuapp.com/api/v2/category/${category}`;

    fetch(url)
        .then(response => response.json())
        .then(apiData => {
            data = apiData;
            showCurrentPage();
            showPaginationButtons();
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
}

function obtainEntry(itemId) {
    const url = `https://botw-compendium.herokuapp.com/api/v3/compendium/entry/` + itemId;
    const modalTitle = document.querySelector('.modal-title')
    const modalImg = document.querySelector('.modal-img');
    const modalBody = document.querySelector('.modal-body');


    fetch(url).then(response => response.json()).then(respuesta => {
        modalTitle.textContent = "Nombre: " + respuesta.data.name;
        modalImg.setAttribute('src', respuesta.data.image);
        modalBody.textContent = "Descripción: " + respuesta.data.description;
    });
}




// Función para mostrar las tarjetas de la página actual
function showCurrentPage() {
    const categoryData = getCategoryData(choosedCategory);
    if (!categoryData) return;

    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const categoryToShow = categoryData.slice(startIndex, endIndex);
    const mainContent = document.getElementById('data-main');
    if (mainContent) {
        mainContent.innerHTML = '';
    }
    categoryToShow.forEach(item => {
        const itemName = item.name;
        const itemImg = item.image;
        const itemId = item.id;

        const cardCol = document.createElement("div");
        cardCol.className = "col-sm-2 h-100 mt-5";
        cardCol.setAttribute("value", itemId);

        cardCol.innerHTML = ` 
        <div class="card-body text-center white-texture">
                    <button class="btn h-100  p-1" data-bs-toggle="modal" data-bs-target="#exampleModal" value="${itemId}">
                    <h2 class="card-title brown-texture text-gold mb-3 fs-3">${itemId}</h2>
                    <img class="w-75 card-img-top" src="${itemImg}" alt="${itemName}">
                    <h2 class="card-title brown-texture text-gold mt-3 mb-0 fs-3">${itemName}</h2>
                    <hr class="m-0 text-gold border-3 opacity-100">
                    </button>
        </div>
        `;

        mainContent.appendChild(cardCol);

    });
    initializeCardButtons();
}

function initializeCardButtons() {
    const cardButtons = document.querySelectorAll('.cardItem button');
    cardButtons.forEach(cardButton => {
        cardButton.addEventListener('click', function () {
            let itemId = cardButton.getAttribute('value');
            obtainEntry(itemId);

        });
    });
};


// Función para obtener datos de la categoría actual
function getCategoryData(category) {
    switch (category) {
        case Categories.EQUIPMENTS:
        case Categories.MONSTERS:
        case Categories.MATERIALS:
            return data.data;
        case Categories.CREATURES:
            return data.data.non_food;
        default:
            return null;
    }
}

// Función para ir a la página anterior
function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        showCurrentPage();
    }
}

// Función para ir a la página siguiente
function goToNextPage() {
    const totalItems = getCategoryData(choosedCategory).length;
    const totalPages = Math.ceil(totalItems / cardsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showCurrentPage();
    }
}

function showPaginationButtons() {
    const navPagination = document.getElementById('navPagination');
    navPagination.classList.remove('collapse');
};

// Función para inicializar los botones de categoría
function initializeCategoryButton(button, category) {
    button.addEventListener('click', function () {
        choosedCategory = category;
        currentPage = 1; // Resetear a la primera página al cambiar de categoría
        obtainDataAndShow(choosedCategory);

    });
}

//LAST ADDED

//END LAS ADDED


document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById('next-button');
    const previousButton = document.getElementById('previous-button');
    const equipmentButton = document.getElementById('equipment-button');
    const monsterButton = document.getElementById('monster-button');
    const materialButton = document.getElementById('material-button');
    const creatureButton = document.getElementById('creature-button');


    if (nextButton && previousButton) {
        nextButton.addEventListener('click', function () {
            goToNextPage();
        });

        previousButton.addEventListener('click', function () {
            goToPreviousPage();
        });
    }



    // Inicializar los botones de categoría NavBar
    initializeCategoryButton(equipmentButton, Categories.EQUIPMENTS);
    initializeCategoryButton(monsterButton, Categories.MONSTERS);
    initializeCategoryButton(materialButton, Categories.MATERIALS);
    initializeCategoryButton(creatureButton, Categories.CREATURES);

    obtainDataAndShow(choosedCategory);
});
