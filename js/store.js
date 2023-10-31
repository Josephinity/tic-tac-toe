const initialState = {
    currentGameMoves: [],
    roundHistory: [],
    allHistory: [],
};



/**
 * Store is (loosely) the "Model" in the MV* or MVC pattern
 *
 * Think of this as our abstraction on top of an arbitrary data store.
 * In this app, we're using localStorage, but this class should not require
 * much change if we wanted to change our storage location to an in-memory DB,
 * external location, etc. (just change #getState and #saveState methods)
 *
 * This class extends EventTarget so we can emit a `statechange` event when
 * state changes, which the controller can listen for to know when to re-render the view.
 */
export default class Store extends EventTarget {
    constructor(key, players) {
        super();

        this.storageKey = key;
        this.players = players;

        /* clears all game history */
        // window.localStorage.setItem(key, JSON.stringify(initialState));
    }


    /** Convenience "getters"
        *
        * To avoid storing a complex state object that is difficult to mutate, we store a simple one (array of moves)
        * and derive more useful representations of state via these "getters", which can be accessed as properties on
        * the Store instance object.
        *
        * @example
        *
        * const store = new Store()
        *
        * // Regular property reference (JS evaluates fn under hood)
        * const game = store.game
        * const stats = store.stats
        * ```
        *
        * @see - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
    */
    get scores () {
        const history = this.#getState().roundHistory;

        const player1Wins = history.filter((game) => {
            return game.winner !== null && game.winner.id === 1;
        }).length,
            player2Wins = history.filter((game) => {
                return game.winner !== null && game.winner.id === 2;
        }).length;

        return {
            player1Wins: player1Wins,
            player2Wins: player2Wins,
            ties: history.length - player1Wins - player2Wins
        };
    }

    get game() {
        const state = this.#getState();
        //game turn starts at 0
        const gameTurn = state.currentGameMoves.length - 1,
            currentPlayer = gameTurn % 2;

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

        const currentPlayMoves = state.currentGameMoves.filter(
            (value, index) => {
                return index % 2 === currentPlayer;
            }
        );

        let winner = null;
        if(gameTurn >= 4) {
            for (const winningState of winningStates) {
                if (winningState.every(
                    (item) => currentPlayMoves.includes(item)
                )) {
                    winner = this.players[currentPlayer];
                    break;
                }
            }
        }

        return {
            isComplete: gameTurn === 8 || winner !== null,
            lastPlayer: this.players[currentPlayer],
            nextPlayer: this.players[(gameTurn + 1) % 2],
            moves: state.currentGameMoves,
            winner: winner
        };
    }


    /** State changing functions */

    /**
     * Resets the game.
     *
     * If the current game is complete, the game is archived.
     * If the current game is NOT complete, it is deleted.
     */
    reset() {
        let newState = structuredClone(this.#getState());

        const game = this.game;
        if(game.isComplete) {
            newState.roundHistory.push(game);
        }
        newState.currentGameMoves = [];

        // console.log(`reset new state ${JSON.stringify(newState)}`);
        this.#saveState(newState);
    }


    /**
     * Resets the scoreboard (wins and ties)
     */
    newRound() {
        this.reset();

        let newState = structuredClone(this.#getState());

        newState.allHistory.push(newState.roundHistory);
        newState.roundHistory = [];

        console.log("new round happens in store");
        this.#saveState(newState);
    }


    /** Player makes a move on an empty square */
    playerMove(squareId) {
        let newState = structuredClone(this.#getState());

        newState.currentGameMoves.push(squareId);

        this.#saveState(newState);
    }


    /**
     * Private state reducer that transitions from the old state to the new state
     * and saves it to localStorage. Every time state changes, a custom 'statechange'
     * event is emitted.
     *
     * @param {*} stateOrFn can be an object or callback fn
     *
     * We are not using Redux here, but it gives a good overview of some essential concepts to managing state:
     * @see https://redux.js.org/understanding/thinking-in-redux/three-principles#changes-are-made-with-pure-functions
     */

    #saveState(stateOrFn) {
        const previousState = this.#getState();

        let newState;
        if(typeof stateOrFn === "function") {
            newState = stateOrFn(previousState);
        } else if(typeof stateOrFn === "object") {
            newState = stateOrFn;
        } else {
            throw new Error("Invalid argument to saveState");
        }
        console.log("saved:")
        console.log(newState);

        window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
        this.dispatchEvent(new Event("statechange"));
    }

    #getState() {
        const item = window.localStorage.getItem(this.storageKey);
        if(item === null) {
            return initialState;
        } else {
            return JSON.parse(item);
        }
    }
}