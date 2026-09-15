//temp board for testing purposes
const tempBoard = [
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

/*
Places a flag at cell [row, col] in board.
Args:
    minesweeper: a minesweeper object that consists of a board, state,
    and flagCount
*/
function placeFlag(minesweeper: {board: number[][], state: number, flagCount: number}, cell: number[]): void 
{
    minesweeper.board[cell[0]][cell[1]] = 1
    minesweeper.flagCount -= 1
}

const minesweeper: {board: number[][], state: number, flagCount: number} = {
    board: tempBoard,
    state: 2,
    flagCount: 10
}

placeFlag(minesweeper, [0,0])
console.log(minesweeper.board)