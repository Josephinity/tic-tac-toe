export type GameState = {
    currentGameMoves: number[],
    roundHistory: any[],
    allHistory: any[],
}

export type Player = {
    id: number,
    name: string,
    icon: string,
    color: string,
}

export type Game = {
    isComplete: boolean,
    lastPlayer: Player,
    nextPlayer: Player,
    moves: number[],
    winner: Player | null
}

export type Scores = {
    player1Wins: number,
    player2Wins: number,
    ties: number,
}
