import type { Player, Game, Scores } from "./types.ts";

/** Options:
 *  Derive a type from a getter method instead of declaring a custom type
 *  Example - the type of 'scores' can be derived from Store.scores()
 */
// import type Store from './store';
// function foo(scores: Store['scores']) {}

/** Options:
 * Declare a custom record type for $
 * so $ can be of type CustomRecordUtility<string, Element>
 * */
// type CustomRecordUtility<TKey extends string, TValue> = {
//     [key in TKey]: TValue;
// };

export default class View {
    $: Record<string, Element> = {}  // Single elements
    $$: Record<string, NodeListOf<Element>> = {}  // Element lists

    constructor() {
        /**
         * Pre-select elements we'll need (for convenience and clarity)
         */

        // Single elements
        this.$.dropdownMenu = this.#qs('[data-id="dropdown"]');
        this.$.menuButton = this.#qs('[data-id="menu-btn"]');
        this.$.resetButton = this.#qs('[data-id="reset-btn"]');
        this.$.newRoundButton = this.#qs('[data-id="new-round-btn"]');
        this.$.modal = this.#qs('[data-id="modal-overlay"]');
        this.$.winner = this.#qs('[data-id="winner"]');
        this.$.modalButton = this.#qs('[data-id="modal-btn"]');
        this.$.panel = this.#qs('[data-id="panel"]');
        this.$.score1 = this.#qs('[data-id="p1-score"]');
        this.$.score2 = this.#qs('[data-id="p2-score"]');
        this.$.tieCount = this.#qs('[data-id="tie-count"]');
        this.$.grid = this.#qs('[data-id="grid"]');

        // Element lists
        this.$$.squares = this.#qsAll('[data-id="square"]');

        /**
         * UI-only event listeners
         *
         * These are listeners that do not mutate state and therefore
         * can be contained within View entirely.
         */
        this.$.menuButton.addEventListener("click", (event) => {
            this.#toggleMenu();
        });
    }


    /**
     * This application follows a declarative rendering methodology
     * and will re-render every time the state changes
     *
     * @see https://www.zachgollwitzer.com/posts/imperative-programming#react-declarative-vs-jquery-imperative
     */
    render(game: Game, scores: Scores) {
        console.log("rendering for")
        console.log(game);

        const { isComplete, lastPlayer, nextPlayer, moves, winner } = game;

        if(!this.$.dropdownMenu.classList.contains("hidden")) {
            this.#toggleMenu();
        }

        if(isComplete) {
            this.#updateSquare(moves[moves.length-1], lastPlayer);
            this.#showModal(winner);
            return;
        }

        if(moves.length === 0) {
            this.#closeModal();
            this.#resetSquares();
            this.#updateScores(scores);
        } else {
            this.#updateSquare(moves[moves.length-1], lastPlayer);
        }

        this.#updatePanel(nextPlayer);
    }

    /** Continue from previous game state on window reload */
    renderOnLoad(game: Game, scores: Scores) {
        this.#updateScores(scores);
        const players = [game.lastPlayer, game.nextPlayer];
        for(let i = game.moves.length - 1, turn = 0; i >= 0; i--, turn++) {
            this.#updateSquare(game.moves[i], players[turn%2]);
        }

        if(game.isComplete) {
            this.#showModal(game.winner);
        }
    }



    /**
     * Events that are handled by the "Controller" in app.js
     * ----------------------------------------------------------
     */
    bindResetEvent(handler: EventListener) {
        this.$.resetButton.addEventListener("click", handler);
        this.$.modalButton.addEventListener("click", handler);
    }

    bindNewRoundEvent(handler: EventListener) {
        this.$.newRoundButton.addEventListener("click", handler);
    }

    /* can be refactored using matches */
    bindPlayerMoveEvent(handler: (square: Element) => void) {
        this.$.grid.addEventListener("click", (event: Event) => {
            if(!(event.target instanceof Element)) {
                throw new Error("Not clicking on an element");
            }

            if(event.target.matches('[data-id="square"]')) {
                handler(event.target);
            }
        });
    }

    /**
     * All methods below ⬇️ are private utility methods used for updating the UI
     * -----------------------------------------------------------------------------
     */
    #toggleMenu() {
        this.$.dropdownMenu.classList.toggle("hidden");
        this.$.menuButton.classList.toggle("border");

        const icon = this.#qs("i", this.$.menuButton);
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
    }

    #resetSquares() {
        this.$$.squares.forEach((square: Element) => {
            square.replaceChildren();
        });
    }

    #showModal(winner: Player | null) {
        if(winner) {
            this.$.winner.textContent= `{winner.name} wins!`;
        } else {
            this.$.winner.textContent = "Tie!";
        }
        this.$.modal.classList.toggle("hidden");
    }

    #closeModal() {
        this.$.modal.classList.add("hidden");
    }

    #updateScores(scores: Scores) {
        this.$.tieCount.innerHTML = scores.ties + " ties";
        this.$.score1.innerHTML = scores.player1Wins + " wins";
        this.$.score2.innerHTML = scores.player2Wins + " wins";
    }

    #updateSquare(squareId: number, player: Player) {
        const squareElement = this.$$.squares[squareId];
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", player.icon, player.color);
        squareElement.replaceChildren(icon);
    }


    //add animation
    #updatePanel(player: Player) {
        this.$.panel.className = "";
        this.$.panel.classList.add("top-panel", player.color);
        this.$.panel.innerHTML = `<i class="fa-solid ${player.icon}"></i>
                                    <p>${player.name}, you're up!</p>`;
    }

    /**
     * The #qs and #qsAll methods are "safe selectors", meaning they
     * guarantee the elements we select exist in the DOM (otherwise throw an error)
     * parent? is an optional parameter that is set to undefined if not provided
     */
    #qs(selector: string, parent?: Element): Element {
        const element = parent ?
            parent.querySelector(selector) :
            document.querySelector(selector);

        if (!element) throw new Error("Could not find element");

        return element;
    }

    #qsAll(selector: string): NodeListOf<Element> {
        const elementList = document.querySelectorAll(selector);

        if (!elementList) throw new Error("Could not find elements");

        return elementList;
    }
}