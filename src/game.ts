import * as Types from './types.js';// imported the types file 
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
//randomly generated a mine count between 10-20 
function mineCount(){
    return Math.floor(Math.random() * (Types.MAX_MINES - Types.MIN_MINES + 1)) + Types.MIN_MINES;
}

//generated the mine in the 
function mineGenerater(board: Types.Board): void {
    const mineAmt = mineCount();
    let minesPlaced = 0;

    while (minesPlaced < mineAmt) {
        const row = Math.floor(Math.random() * Types.BOARD_SIZE);
        const col = Math.floor(Math.random() * Types.BOARD_SIZE);

        if (!board.cells[row][col].isMine) {
            board.cells[row][col].isMine = true; //declared that its a mine 
            minesPlaced++;
        }
    }
}

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

function renderBoard(){
    const board = Types.createEmptyBoard(Types.BOARD_SIZE, Types.BOARD_SIZE, mineCount());
    mineGenerater(board);
    return board;
}

//print the board 
function printBoard(board: Types.Board){
    for (let row = 0; row < Types.BOARD_SIZE; row++) {
    let line = "";

    for (let col = 0; col < Types.BOARD_SIZE; col++) {
        if (board.cells[row][col].isMine) {
            line += "3 "; //3 = mine 
        } else {
            line += "0 ";
        }
    }

    console.log(line);
    }
}


placeFlag(minesweeper, [0,0])
console.log(minesweeper.board)


const board = renderBoard();
printBoard(board);



