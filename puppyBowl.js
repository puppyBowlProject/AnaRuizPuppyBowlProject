const cards = document.querySelector('.cards');
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const addButton = document.getElementById('add-button');
const closeButton = document.querySelector('.close');



// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2308-ACC-ET-WEB-PT-A';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const result = await response.json();
        console.log(result.data.players);
        return result.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};


const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`);
        console.log(response);
        const data = await response.json();
        console.log(data.data.player);
        return data.data.player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */

const renderAllPlayers = (playerList) => {
    try {
       const template = playerList.map(player => {
        return (
            `<section class="cards">
             <img class="playerImg" src="${player.imageUrl}" alt="">
             <p>${player.name}</p>
             <button class="details-button" data-id="${player.id}">Details</button>
             <button class="delete-button" data-id="${player.id}">Remove Player</button>
            </section>`
        )
        }).join('');
        playerContainer.innerHTML = template;
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderSinglePlayer = (player) => {
    try {
        const template = (
           `<div class="puppy-details">
            <button class="close">X</button>
            <h2>${player.name}</h2>
            <img src="${player.imageUrl}" height="70%" width="50%" alt="">
            <p>${player.breed}</p>
            <p>${player.status}</p>`
        );
        console.log(template);
        playerContainer.innerHTML = template;
    } catch (err){
        console.error(`uh oh, trouble rendering ${player}!`)
    }
}



playerContainer.addEventListener('click', async e => {
    if(e.target.matches('.close')) {
        console.log("close-buton");
        init();
    }
});

playerContainer.addEventListener('click', async e => {
    if(e.target.matches('.details-button')) {
        console.log("click-details");
        console.log(e.target);
        const id = e.target.dataset.id;
        console.log(id);
        const player = await fetchSinglePlayer(id);
        renderSinglePlayer(player);
    };
})


const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        //console.log(data.data.player.id);
        init();
            }
     catch (err) {
        console.error(
            `Whoops, trouble removing player ${playerId} from the roster!`,
            err
        );
};
}

playerContainer.addEventListener('click', async (e) => {
    if(e.target.matches('.delete-button')) {
        console.log("click-delete");
        console.log(e.target);
        const id = e.target.dataset.id;
        console.log(id);
        init();
        await removePlayer(id);
        }
    })


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const template = 
            (
               `<form action="">
                <label for="">Puppy Name</label>
                <input id="puppyName" type="text" name="" id="">
                <label for="">Puppy Breed</label>
                <input id="puppyBreed" type="text">
                <label for="">Status</label>
                <input id="status" type="text">
                <label for="">Image</label>
                <input id="image" type="text">
                <button class="add-button">Add New Puppy</button>
                </form>`
            );
            newPlayerFormContainer.innerHTML = template;
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const addNewPlayer = async(playerObj) => {
    try {
        const newPlayerName = document.getElementById('puppyName');
        const newPlayerBreed = document.getElementById('puppyBreed');
        const newPlayerStatus = document.getElementById('status');
        const newPlayerImage = document.getElementById('image');
        const newPlayer = {
                    name: newPlayerName.value,
                    breed: newPlayerBreed.value,
                    status: newPlayerStatus.value.toString(),
                    image: newPlayerImage.value, 
                    };
        const response = await fetch(APIURL, {
                    method: `POST`,
                    headers: {'Content-Type': 'application/json',},
                    body: JSON.stringify({...newPlayer}),
                    });
        const result = await response.json();
        console.log(result);
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!')
    }
}

newPlayerFormContainer.addEventListener('submit', async (event) => {
    event.preventDefault();
    addNewPlayer();
})


const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
    
}

init();