import View from "./view.js"
import Store from "./store.js"
import type { Player } from "./types";

const players: Player[] = [
    {
        id: 1,
        name: "Player 1",
        icon: "fa-x",
        color: "turquoise"
    },
    {
        id: 2,
        name: "Player 2",
        icon: "fa-o",
        color: "yellow"
    }
];


function init() {

    const store = new Store("my-cat", players);
    const view = new View();

    window.addEventListener("storage", () => {
        console.log("State changed from another tab");
        view.render(store.game, store.scores);
    });

    // When the HTML document first loads, render the view based on the current state.
    view.renderOnLoad(store.game, store.scores);

    store.addEventListener("statechange", () => {
        view.render(store.game, store.scores);
    });

    view.bindResetEvent((event) => {
        store.reset();
    });

    view.bindNewRoundEvent((event) => {
        store.newRound();
    });

    view.bindPlayerMoveEvent((square: Element) => {
        if(!square.firstElementChild) {
            square.appendChild(document.createElement("i"));
        } else

        if(square.firstElementChild.classList.length === 0) {
            store.playerMove(+square.id);
        }
    });

}

window.addEventListener("load", init);

