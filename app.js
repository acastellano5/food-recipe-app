const form = document.querySelector('form');
const input = document.querySelector('input');
const row = document.querySelector('.meals-container');

const getID = async (id) => {
    const req = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    return req.data.meals[0].strInstructions;
}

const getVideo = async (id) => {
    const req = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    return req.data.meals[0].strYoutube;
}

const createCard = async (meal) => {
    // creates column
    const col = document.createElement('div');
    col.classList.add('col-9', 'col-sm-5', 'col-lg-3', 'm-3', 'meal-block');
    row.append(col);

    // creates card
    const card = document.createElement('div');
    card.classList.add('card');
    col.append(card);


    // creates img 
    const img = document.createElement('img');
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    img.classList.add('card-img-top');
    card.append(img);

    // create card-body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'text-center');
    card.append(cardBody);

    // creates p for food name 
    const foodName = document.createElement('p');
    foodName.classList.add('food-name', 'text-center', 'mb-2', 'text-white');
    foodName.innerText = meal.strMeal;
    cardBody.append(foodName);

    // creates recipe button
    const recipeBtn = document.createElement('button');
    recipeBtn.classList.add('recipe-btn', 'btn');
    recipeBtn.innerText = 'Get Recipe';
    cardBody.append(recipeBtn);

    recipeBtn.addEventListener('click', () => {
        let allRecipe = document.querySelectorAll('.meal-recipe');
        for (let recip of allRecipe) {
            recip.classList.remove('show');
        }
        let recipe = recipeBtn.parentElement.parentElement.children[2];
        recipe.classList.toggle('show');
    });

    // creates the recipe pop up
    const recipeContainer = document.createElement('div');
    recipeContainer.classList.add('meal-recipe', 'container', 'py-3', 'text-center', 'text-white'); 
    card.append(recipeContainer);

    // creates close btn
    const closeCol = document.createElement('div');
    closeCol.classList.add('d-flex', 'justify-content-end', 'mb-3');
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-container')
    closeBtn.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x close-btn" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';

    closeBtn.addEventListener('click', () => {
        let recipe = recipeBtn.parentElement.parentElement.children[2];
        recipe.classList.toggle('show');
    })

    closeCol.append(closeBtn);
    recipeContainer.append(closeCol);

    // creates h3 for foodname
    const h3 = document.createElement('h3');
    h3.innerText = meal.strMeal;
    recipeContainer.append(h3)

    // creates instructions heading
    const h5 = document.createElement('h5');
    h5.classList.add('instr-head');
    h5.innerText = 'Instructions';
    recipeContainer.append(h5);

    // creates p for instructions
    const instructions = document.createElement('p');
    instructions.classList.add('instr-text', 'mb-3');
    instructions.innerText = await getID(meal.idMeal);
    recipeContainer.append(instructions);

    // creates video icon
    const videoIcon = document.createElement('div');
    videoIcon.classList.add('d-flex', 'flex-column', 'align-items-center');
    videoIcon.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="instr-img mb-2">`;
    const videoLink = document.createElement('a');
    videoLink.href = await getVideo(meal.idMeal);
    videoLink.classList.add('video-link');
    videoLink.innerHTML = 'Watch Video';
    recipeContainer.append(videoIcon);
    videoIcon.append(videoLink);
}

const getInfo = (allMeals) => {
    for (let meal of allMeals) {
        try {
            createCard(meal);
        } catch (e) {
            
        }
    }
}

const displayErr = () => {
    const errMsg = document.createElement('p');
    errMsg.classList.add('err-msg', 'text-white', 'text-center', 'display-5');
    errMsg.innerHTML = "<p>Sorry! We couldn't find <br> any recipes.</p>";
    row.append(errMsg);
}

const getMeals = async () => {
    try {
        let inp = input.value;
        const req = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${inp}`);
        const allMeals = req.data.meals;

        getInfo(allMeals);
    } catch (e) {
        console.log(e);
        displayErr();
    }
}

const rmExisting = (className) => {
    const existing = document.querySelectorAll(`.${className}`);
    for (let el of existing) {
        el.remove();
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();
    rmExisting('meal-block');
    rmExisting('err-msg');
    getMeals();
    input.value = '';
})