import * as Types from './types.js';// imported the types file 
import * as readline from 'readline';
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

function updateAdjacentMines(board: Types.Board, row: number, col: number): void {

    const offsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1]
    ];

    for (const [rowOffset, colOffset] of offsets) {

        const neighborRow = row + rowOffset;
        const neighborCol = col + colOffset;

        if (neighborRow >= 0 &&
            neighborRow < Types.BOARD_SIZE &&
            neighborCol >= 0 &&
            neighborCol < Types.BOARD_SIZE) {

            board.cells[neighborRow][neighborCol].adjacentMines += 1;
        }
    }
}
function isSafeCell(row: number, col: number, row_cell: number, col_cell: number): boolean {

    return Math.abs(row - row_cell) <= 1 &&
           Math.abs(col - col_cell) <= 1;
}
//generated the mine in the 
function mineGenerater(board: Types.Board, cell_row: number, cell_col: number): void {

    const mineAmt = mineCount();
    let minesPlaced = 0;

    while (minesPlaced < mineAmt) {

        const row = Math.floor(Math.random() * Types.BOARD_SIZE);
        const col = Math.floor(Math.random() * Types.BOARD_SIZE);

        if (!board.cells[row][col].isMine && !isSafeCell(row, col, cell_row, cell_col)) {

            board.cells[row][col].isMine = true;
            minesPlaced++;

            updateAdjacentMines(board, row, col);
        }
    }
}

//places a flag
function placeFlag(board: Types.Board, row: number, col: number): void 
{
    if (row >= 0 && row < board.rows && col >= 0 && col < board.cols)
    {
       board.cells[row][col].state = 'flagged';
    }
}
function removeFlag(board: Types.Board, cell: Types.Cell): void 
{
    cell.state = 'covered';
}

//handles functionality for clicking a cell
function clickCell(board: Types.Board, row: number, col: number): void
{
   if (board.cells[row][col].state == 'covered')
    {
        if (board.cells[row][col].isMine)
        {
            board.gameStatus = 'lost';
            return;
        }
        else 
        {
            board.cells[row][col].state = 'revealed'
            if (board.cells[row][col].adjacentMines == 0)
            {
                uncoverNeighbors(board, row, col);
            }
        }
    }
    else if(board.cells[row][col].state == 'revealed'){
        return;
    }
}

// uncovers neighbor cells that have zero adjacent mines
function uncoverNeighbors(board: Types.Board, row: number, col: number): void {
    const cellsToVisit: [number, number][] = [[row, col]];

    while (cellsToVisit.length > 0) {
        const [currentRow, currentCol] = cellsToVisit.pop()!;

        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                const neighborRow = currentRow + rowOffset;
                const neighborCol = currentCol + colOffset;

                if (neighborRow < 0 || neighborRow >= board.rows ||
                    neighborCol < 0 || neighborCol >= board.cols) {
                    continue;
                }

                const neighbor = board.cells[neighborRow][neighborCol];
                if (neighbor.state !== 'covered' || neighbor.isMine) {
                    continue;
                }

                neighbor.state = 'revealed';
                if (neighbor.adjacentMines === 0) {
                    cellsToVisit.push([neighborRow, neighborCol]);
                }
            }
        }
    }
}


function renderBoard(row: number, col: number) {
    const board = Types.createEmptyBoard(
        Types.BOARD_SIZE,
        Types.BOARD_SIZE,
        mineCount(),
        'ready'
    );

    mineGenerater(board, row, col);

    return board;
}

function win(board: Types.Board): void {
    for (let row = 0; row < Types.BOARD_SIZE; row++) {
        for (let col = 0; col < Types.BOARD_SIZE; col++) {
            const cell = board.cells[row][col];

            // If this is not a mine and is still hidden
            if((cell.state == 'covered') || (cell.isMine && cell.state != 'flagged') ){
                return;
            }
            
        }
    }
    board.gameStatus = 'won';
}
    


//print the board 
function printBoard(board: Types.Board){
    for (let row = 0; row < Types.BOARD_SIZE; row++) {
    let line = "";

    for (let col = 0; col < Types.BOARD_SIZE; col++) {
        const cell = board.cells[row][col];
        if (board.cells[row][col].isMine) {
            line += "3 "; //3 = mine 
        }
        else if (board.cells[row][col].state == 'flagged'){
            line += "1 ";
        } 
        else if (board.cells[row][col].state == 'revealed'){
            line += cell.adjacentMines + " ";
        }
        else {
            line += "- ";
        }
    }

    console.log(line);
    }
}


//temp testing 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question: string): Promise<string> {
    return new Promise(resolve => rl.question(question, resolve));
}

async function testGame() {
    const input = await ask("\nEnter row col (q to quit): ");

        if (input === 'q') {
            return;
        }
    const [row, col] = input.split(' ').map(Number);

    const board = renderBoard(row, col);
    clickCell(board, row, col);

    printBoard(board);

    while (board.gameStatus !== 'lost') {

        const input = await ask("\nEnter row col (q to quit): ");

        if (input === 'q') {
            return;
        }

        const [row, col] = input.split(' ').map(Number);

        const action = await ask("Reveal or flag? (r/f): ");

        if (action === 'r') {
            clickCell(board, row, col);
        }
        else if (action === 'f') {
            placeFlag(board, row, col);
        }

        printBoard(board);
    }

    rl.close();
}

testGame();
