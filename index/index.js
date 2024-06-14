const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDownMenu = document.querySelector('.dropdown_menu');

toggleBtn.onclick = function(){
    dropDownMenu.classList.toggle('open');
    const isOpen = dropDownMenu.classList.contains('open')

    toggleBtnIcon.classList = isOpen
    ? 'fa-solid fa-xmark'
    : 'fa-solid fa-bars'
}

document.getElementsByClassName('login')[0].addEventListener("click", function(){
     document.querySelector('.popup').style.display = 'flex';
})
document.getElementsByClassName('login')[1].addEventListener("click", function(){
    document.querySelector('.popup').style.display = 'flex';
})


document.getElementsByClassName('exit_popup')[0].addEventListener('click', function(){
    document.querySelector('.popup').style.display = 'none';
})

const login_box = document.querySelector('.login_box');
const signin_link = document.querySelector('.signin_link');
const login_link = document.querySelector('.login_link');

signin_link.addEventListener('click', function(){
    login_box.classList.add('active');
})

login_link.addEventListener('click', function(){
    login_box.classList.remove('active');
})

function see_password(i, j){
    let visibility = document.getElementsByClassName('hidden_password')[i];
    let eye_version = j.querySelector('i');

    if (visibility.type === 'password'){
        visibility.type = 'text';
        eye_version.classList.remove("fa-eye-slash");
        eye_version.classList.add("fa-eye");
    }
    else{
        visibility.type = 'password';
        eye_version.classList.remove("fa-eye");
        eye_version.classList.add("fa-eye-slash");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const images = [
        'media/anshu-a--7LeAsLS0FA-unsplash.png',
        'media/todd-quackenbush-x5SRhkFajrA-unsplash.png',
        'media/lauren-gray-Zqh5l1JWs5M-unsplash.png',
        'media/phil-hearing-32w8MNBuxPk-unsplash.png',
        'media/simona-sergi-k87kcKN-Vvs-unsplash.png',
        'media/anshu-a-NVX1scNPthk-unsplash.png',
        'media/tamara-gak-SQLOsc0HGDI-unsplash.png'
    ];
    
    const homeDiv = document.getElementById('home');
    
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        if (index === 0) img.classList.add('active');
        homeDiv.appendChild(img);
    });

    let currentImageIndex = 0;

    setInterval(() => {
        const imgs = homeDiv.querySelectorAll('img');
        imgs[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        imgs[currentImageIndex].classList.add('active');
    },  3000); 
});


/*search*/
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search_id');
    if (searchForm) {
        searchForm.addEventListener('submit', fetch_data);
    }
});

async function fetch_data(event) {
    event.preventDefault();
    
    const dishName = document.getElementById('dish_name').value;
    const cuisines = Array.from(document.getElementById('cuisine').selectedOptions).map(option => option.value).join(',');
    const excludeCuisines = Array.from(document.getElementById('exc_cuisine').selectedOptions).map(option => option.value).join(',');
    const diets = Array.from(document.getElementById('diet').selectedOptions).map(option => option.value).join(',');
    const intolerances = Array.from(document.getElementById('intolerances').selectedOptions).map(option => option.value).join(',');
    const mealTypes = Array.from(document.getElementById('meal_type').selectedOptions).map(option => option.value).join(',');
    const includeIngredients = document.getElementById('inc_ingredients').value;
    const excludeIngredients = document.getElementById('exc_ingredients').value;
    const minCalories = document.getElementById('min_cal').value;
    const maxCalories = document.getElementById('max_cal').value;

    const apiKey = '2df4c9b3deaa4f4f963d1a72337ae635';


    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${dishName}&intolerances=${intolerances}&apiKey=${apiKey}`);
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        const searchResultsContainer = document.querySelector('.search');

        searchResultsContainer.innerHTML = '';

        data.results.forEach(dish => {
            // div to contain each dish
            const dishContainer = document.createElement('div');
            dishContainer.classList.add('dish');

            // image of the dish
            const dishImage = document.createElement('img');
            dishImage.src = dish.image;
            dishImage.alt = dish.title;
            dishImage.dataset.recipeId = dish.id;
            dishImage.classList.add('dish-image'); 
            dishContainer.appendChild(dishImage);

            // the dish name
            const dishNameElement = document.createElement('p');
            dishNameElement.textContent = dish.title;
            dishContainer.appendChild(dishNameElement);

            dishImage.addEventListener('click', async (event) => {
                const recipeId = event.target.dataset.recipeId;
                await handleImageClick(recipeId, dishContainer);
            });

            searchResultsContainer.appendChild(dishContainer);
        });
    } catch (error) {
        console.error(error);
    }
}

async function fetchIngredients(recipeId) {
    const apiKey = '2df4c9b3deaa4f4f963d1a72337ae635';
    const url = `https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch ingredients');
        }

        const data = await response.json();
        return data.ingredients;
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        return [];
    }
}

async function handleImageClick(recipeId, dishContainer) {
    const ingredientsElement = dishContainer.querySelector('.image-ingredients');
    if (ingredientsElement) {
        ingredientsElement.remove();
    } else {
        const ingredients = await fetchIngredients(recipeId);

        const ingredientList = ingredients.map(ingredient => {
            const amount = ingredient.amount.metric.value;
            const unit = ingredient.amount.metric.unit;
            const name = ingredient.name;
            return `${amount}${unit} ${name}`;
        }).join(', ');

        const ingredientsElement = document.createElement('div');
        ingredientsElement.textContent = ingredientList;
        ingredientsElement.classList.add('image-ingredients');

        const sourceInfo = await fetchSourceInfo(recipeId);
        const sourceName = sourceInfo.sourceName;
        const sourceUrl = sourceInfo.sourceUrl;

        const sourceLink = document.createElement('a');
        sourceLink.textContent = `Check out the recipe on ${sourceName}`;
        sourceLink.href = sourceUrl;
        sourceLink.target = '_blank';
        sourceLink.classList.add('source-link');

        dishContainer.appendChild(ingredientsElement);
        dishContainer.appendChild(sourceLink);
    }
}

async function fetchSourceInfo(recipeId) {
    const apiKey = '2df4c9b3deaa4f4f963d1a72337ae635';
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch source information');
        }

        const data = await response.json();
        return {
            sourceName: data.sourceName,
            sourceUrl: data.sourceUrl
        };
    } catch (error) {
        console.error('Error fetching source information:', error);
        return {
            sourceName: 'Unknown',
            sourceUrl: '#'
        };
    }
}


// wine
document.addEventListener('DOMContentLoaded', () => {
    const wineForm = document.getElementById('wine_form');
    if (wineForm) {
        wineForm.addEventListener('submit', fetch_wine);
    }
});

async function fetch_wine(event) {
    event.preventDefault();

    const dishInput = document.getElementById('dishInput').value;
    const apiKey = '05a62962c9b94c0d89b7aa1df6d7243a';

    try {
        console.log(`Fetching wine pairing for dish: ${dishInput}`);
        const response = await fetch(`https://api.spoonacular.com/food/wine/pairing?food=${dishInput}&apiKey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        console.log('Wine pairing data:', data);
        displayWineData(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayWineData(data) {
    const wineResults = document.getElementById('wine_results');
    wineResults.innerHTML = ''; // Clear previous results

    if (!data.pairingText || data.productMatches.length === 0) {
        wineResults.textContent = 'No wine pairings found.';
        return;
    }

    const wineImage = document.createElement('img');
    wineImage.src = data.productMatches[0].imageUrl;
    wineImage.classList.add('wine-image');
    wineResults.appendChild(wineImage);

    const winePairingText = document.createElement('p');
    winePairingText.textContent = data.pairingText;
    winePairingText.classList.add('wine-pairing');
    wineResults.appendChild(winePairingText);

    const winePrice = document.createElement('p');
    winePrice.textContent = `Price: ${data.productMatches[0].price}`;
    winePrice.classList.add('wine-price');
    wineResults.appendChild(winePrice);

    const wineLink = document.createElement('a');
    wineLink.href = data.productMatches[0].link;
    wineLink.classList.add('wine-link');
    wineLink.textContent = "Buy now";
    wineLink.target = "_blank";
    wineResults.appendChild(wineLink);
}
