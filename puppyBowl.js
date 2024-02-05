const cards = document.getElementById('cards');
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const addButton = document.getElementById('add-button');
const detailsButton = document.getElementById('details-button');
const deleteButton = document.getElementById('delete-button');



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
        const result = await response.json();
        console.log(result);
        return result;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

//Testing fetchSinglePlayer function:
//fetchSinglePlayer(4497);

detailsButton.addEventListener('click', fetchSinglePlayer);

const addNewPlayer = async (playerObj) => {
    try {
        newPlayerFormContainer.addEventListener('submit', async (event) => {
            event.preventDefault();
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...newPlayer}),
            });
            
            newPlayerName.value = '',
            newPlayerBreed.value = '',
            newPlayerStatus.value = '',
            newPlayerImage.value = '',
            
            init();
        });
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

addNewPlayer();




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
             <button class="details-button">See Details</button>
             <button class="delete-button" data-id="${player.id}">Remove Player</button>
            </section>`
        )
        }).join('');
        playerContainer.innerHTML = template;
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


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

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
    
}

const removePlayer = async (playerId) => {
    try {
       await fetch(`${APIURL}/${players.id}`), {
        method: `DELETE`,
       };
                init();
            }
     catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
};
}

deleteButton.addEventListener('click', removePlayer());
fs
init();