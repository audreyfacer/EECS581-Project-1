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

//places a flag
function placeFlag(board: Types.Board, cell: Types.Cell): void 
{
    cell.state = 'flagged'
}

//handles functionality for clicking a cell
function clickCell(board: Types.Board, row: number, col: number): void
{
    //TODO: finish
    if (board.cells[row][col].state == 'flagged'){
        board.cells[row][col].state = 'covered'
    }
    else if (board.cells[row][col].state == 'covered')
    {
        if (board.cells[row][col].isMine)
        {
            board.gameStatus = 'lost'
            return;
        }
        else 
        {
            board.cells[row][col].state = 'revealed'
            // now do recursion for revealing other open spaces next to it
        }
    }
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
        }
        else if (board.cells[row][col].state == 'flagged'){
            line += "1 ";
        } 
        else {
            line += "0 ";
        }
    }

    console.log(line);
    }
}

// temporary testing 
const board = renderBoard();
placeFlag(board, board.cells[0][1])
printBoard(board);



