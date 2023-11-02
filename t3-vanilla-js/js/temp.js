let turn = tie = 0;
let score = [0, 0];
let moves = [
    [],
    []
];

const players = [
    {
        "id": 1,
        "name": "Player 1",
        "icon": "fa-x",
        "color": "turquoise"
    },
    {
        "id": 2,
        "name": "Player 2",
        "icon": "fa-o",
        "color": "yellow"
    }
];

const winningStates = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];




/* track all selected HTML elements to App */
const App = {
    $: {
        /* assign data-* attribute to html elements for safer selector */
        dropdownMenu: document.querySelector('[data-id="dropdown"]'),
        menuButton: document.querySelector('[data-id="menu"]'),
        resetButton: document.querySelector('[data-id="reset-btn"]'),
        newRoundButton: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
        modal: document.querySelector(".modal"),
        winner: document.querySelector('[data-id="winner"]'),
        modalButton: document.querySelector('[data-id="modal-btn"]'),
        panel: document.querySelector('[data-id="panel"]'),
        panelIcon: document.querySelector('[data-id="panel-icon"]'),
        panelMessage: document.querySelector('[data-id="panel-message"]'),
        score1: document.querySelector('[data-id="p1-score"]'),
        score2: document.querySelector('[data-id="p2-score"]'),
        tieCount: document.querySelector('[data-id="tie-count"]'),
    },

    /* add all event listenners to init() */
    init() {
        App.registerEventListener();
    },

    registerEventListener() {
        // done
        App.$.menuButton.onclick = () => {
            App.$.dropdownMenu.classList.toggle("hidden");
        };

        App.$.newRoundButton.onclick = () => {
            resetGame();
            clearAllData();
        }

        #binded
        App.$.resetButton.onclick = () => {
            resetGame();
        }

        #binded
        App.$.modalButton.onclick = () => {
            resetGame();
            App.$.modal.classList.toggle("hidden");
            updateScore();
        }

        #binded
        App.$.squares.forEach(square => {
            /* register event listener with the callback function (event) => {} */
            square.onclick = (event) => {
                if(square.firstElementChild.classList.length === 0) {
                    move(square);
                }
            }
        });
    }
}



function move(square) {
    /*
        const square = event.target;
        if(event.target.firstElementChild.classList.length > 0) return;

        !!!Above statement is incorrect: event.target is NOT a square
        when the user clicks on the inner icon within the square.
        In which case, the event target is the icon and
        icon.firstChildElement throws a null pointer exception !!!
        Fix: put the IF check in App.$.squares.forEach(square => {square.onclick()})
        so the IF check applies to a square instead of event.target.
     */
    const squareId = Number(square.id);
    const turnPlayer = turn % 2, playerId = turnPlayer + 1;
    square.firstElementChild.classList.add("fa-solid", players[turnPlayer]["icon"], players[turnPlayer]["color"]);
    moves[turnPlayer].push(squareId);

    console.log(moves[0]);
    console.log(moves[1]);
    let endGame = false;
    winningStates.forEach(state => {
        const line = moves[turnPlayer].filter(
            (value) => state.includes(value) //find common elements in state and player's moves
        );

        if(line.length === 3) {
            score[turnPlayer] += 1;
            endGame = true;
            showModal(turnPlayer);
        }
    })
    if(!endGame && turn >= 8) {
        showModal("tie");
        tie += 1;
        updateScore();
    } else {
        turn += 1;
    }
    updatePanel();
}

/* promps the modal */
function showModal(winner) {
    if(winner === "tie") {
        App.$.winner.innerText = "Tie!";
    } else {
        App.$.winner.innerText = players[winner]["name"] + " wins!";
    }
    App.$.modal.classList.toggle("hidden");
}

/* reset scores, turns and the board */
function clearAllData() {
    tie = 0;
    score = [0, 0];
    resetGame();
    updateScore();
}


/* reset the board */
function resetGame() {
    turn = 0;
    moves[0] = [];
    moves[1] = [];
    App.$.squares.forEach(square => {
        square.innerHTML = "<i></i>";
    });
    updatePanel();
}

/* update score counts */
function updateScores() {
    App.$.tieCount.innerHTML = tie + " ties";
    App.$.score1.innerHTML = score[0] + " wins";
    App.$.score2.innerHTML = score[1] + " wins";
}

/* update top panel message */
function updatePanel() {
    const playerId = turn % 2;
    const otherPlayerId = (turn + 1) % 2;
    App.$.panelMessage.classList.replace(players[otherPlayerId]["color"], players[playerId]["color"]);
    App.$.panelIcon.classList.replace(players[otherPlayerId]["color"], players[playerId]["color"]);
    App.$.panelIcon.classList.replace(players[otherPlayerId]["icon"], players[playerId]["icon"]);
    App.$.panelMessage.innerText = "Player " + (playerId + 1) + ", you're up!";
}
