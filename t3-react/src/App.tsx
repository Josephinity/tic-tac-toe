import React, { useState } from "react";
import classNames from "classnames";
import { Player, GameState, Game, Scores } from "./types";
import "./App.css";
import { useLocalStorage } from "./useLocalStorage"
import Footer from "./components/footer";
import Menu from "./components/menu";
import Modal from "./components/modal";


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
function game(state: GameState): Game {
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
            if (winningState.every((item) =>
                currentPlayMoves.includes(item)
            )) {
                winner = players[currentPlayer];
                break;
            }
        }
    }

    return {
        isComplete: gameTurn === 8 || winner !== null,
        lastPlayer: players[currentPlayer],
        nextPlayer: players[(gameTurn + 1) % 2],
        moves: state.currentGameMoves,
        winner: winner
    };
}


function deriveScores(state: GameState): Scores {
    const history = state.roundHistory;

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


export default function App() {

    const [state, setState] = useState<GameState>({
        currentGameMoves: [],
        roundHistory: [],
        allHistory: [],
    });

    /* Use local storage to enable updates across tabs */
    // const [state, setState] = useLocalStorage("my-cat"
    //     , {
    //         currentGameMoves: [],
    //         roundHistory: [],
    //         allHistory: [],
    //     } // as GameState
    // );

    const { isComplete, lastPlayer, nextPlayer, winner, moves } = game(state);
    let scores = deriveScores(state);

    let isMenuOpen = false;

    function playerMove(squareId: number) {
        if(state.currentGameMoves.includes(squareId)) return;

        setState((prev: GameState) => {
            let newState = structuredClone(prev);

            newState.currentGameMoves.push(squareId);

            return newState;
        })
    }

    const reset = (isNewRound: boolean): void => {

        setState((prev: GameState) => {
            // console.log(`prevState on ${isNewRound ? "new-round-clicked": "reset-clicked"} = ${JSON.stringify(prev)}`)
            // console.log(`prevState on ${isNewRound ? "new-round-clicked": "reset-clicked"} = ${JSON.stringify(state)}`)
            let newState = structuredClone(prev);

            if(isComplete) {
                newState.roundHistory.push({isComplete: isComplete, winner: winner, moves: moves});
            }
            newState.currentGameMoves = [];

            if(isNewRound) {
                newState.allHistory.push(newState.roundHistory);
                newState.roundHistory = [];
                // scores = deriveScores(newState);
                console.log(` NEW-ROUND CLICKED `);
            }

            return newState;
        });
    };

    // @ts-ignore
    return (
        <>
        <main className="centered-column-flex">
            <div className="grid" data-id="grid">
                <div className={classNames("top-panel", nextPlayer.color)}>
                    <i className={classNames("fa-solid", nextPlayer.icon)}></i>
                    <p>{nextPlayer.name}, you're up!</p>
                </div>

                <Menu dropDown={isMenuOpen} onAction={(action) => {
                    /*
                    * Must use if else, otherwise reset(true) and reset(false) will be using the same prev state
                    * and the changed state of the first call will not be saved
                    * */

                    action === "new-round" ? reset(true): reset(false);

                    /* !!!! Unsolved Issue here: both reset() calls are using the same prev state while using local storage.
                    *  How to make 2nd reset() call use an updated state by the 1st call in localStorage?>
                    * */
                    // action === "new-round" && reset(true);
                    // reset(false);
                }} />

                {[0,1,2,3,4,5,6,7,8].map((squareId) => {
                    const indexOfMove = state.currentGameMoves.findIndex(move =>
                        squareId === move
                    );

                    return (<div key={squareId} className="square shadow" onClick={() =>
                        {
                            playerMove(squareId);
                            //how to control menu toggle here?
                        }
                    }>
                        {indexOfMove !== -1 &&
                            <i className={classNames("fa-solid",
                            (indexOfMove % 2) === 0 ? "fa-x": "fa-o",
                            (indexOfMove % 2) === 0 ? "turquoise": "yellow")}
                            ></i>
                        }
                    </div>)
                    }
                )}

                {/* To specify multiple styles   style={{prop1: "val1", prop2: "val2", ...}} */}
                <div className="score centered-column-flex shadow" style={{ backgroundColor: "var(--turquoise)" }}>
                    <h5>Player 1</h5>
                    <p>{scores.player1Wins} wins</p>
                </div>
                <div className="score centered-column-flex shadow" style={{ backgroundColor: "white" }}>
                    <h5>Ties</h5>
                    <p>{scores.ties} ties</p>
                </div>
                <div className="score centered-column-flex shadow" style={{ backgroundColor: "var(--yellow)" }}>
                    <h5>Player 2</h5>
                    <p>{scores.player2Wins} wins</p>
                </div>

            </div>
            <Footer />
        </main>

        {isComplete &&
        <Modal text={winner === null ? "Tie!" : `${winner.name} wins!`}
               reset={() => reset(false)}/>
        }
        </>
    );
}