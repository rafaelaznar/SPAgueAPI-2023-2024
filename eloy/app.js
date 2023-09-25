const blogEntriesContainer = document.getElementById('blog-entries');

async function fetchBlogEntries() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error('Error al obtener las recetas de comida:', error);
    }
}

function createBlogEntry(entry) {
    const blogEntry = document.createElement('div');
    blogEntry.classList.add('col-lg-4', 'col-md-6', 'mb-4');

    const card = document.createElement('div');
    card.classList.add('card', 'h-100');

    const image = document.createElement('img');
    image.classList.add('card-img-top');
    image.src = entry.strMealThumb;
    image.alt = entry.strMeal;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = entry.strMeal;

    cardBody.appendChild(title);
    card.appendChild(image);
    card.appendChild(cardBody);
    blogEntry.appendChild(card);

    card.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('myModal'), {
            keyboard: true
        });
        
        const modalTitle = document.querySelector('.modal-title');
        const modalContent = document.querySelector('.modal-body');

        modalTitle.textContent = entry.strMeal;
        modalContent.textContent = entry.strInstructions;
        
        modal.show();
    });

    return blogEntry;
}

async function displayBlogEntries() {
    const blogEntries = await fetchBlogEntries();

    if (!blogEntries) {
        return;
    }

    const blogEntriesFragment = document.createDocumentFragment();

    blogEntries.forEach(entry => {
        const blogEntry = createBlogEntry(entry);
        blogEntriesFragment.appendChild(blogEntry);
    });

    blogEntriesContainer.innerHTML = '';
    blogEntriesContainer.appendChild(blogEntriesFragment);
}

displayBlogEntries();
