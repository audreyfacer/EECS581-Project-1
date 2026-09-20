/*
 * Module: game.ts
 * Description: Implements Minesweeper board creation, mine placement, cell
 * revealing, flagging, win detection, and loss handling.
 *
 * Inputs: Mine counts and board coordinates supplied by the UI or tests.
 * Outputs: Mutates Board objects to reflect the current game state.
 *
 * Authors: Heidi Schieber, Lilly Tran, and Aayush Gajakas
 * Creation Date: September 15, 2026
 * External Sources: No external code was copied; implementation uses the
 * Minesweeper rules defined by the project requirements.
 */
import { createEmptyBoard, type Board } from './types.js';

/**
 * Checks if a cell falls within a safe area centered at (safeRow, safeCol).
 * 
 * Utilized when placing mines to ensure the first cell clicked by the player and
 * it's 8 neighboring cells don't contain mines.
 * 
 * @param row - The target cell's row index.
 * @param col - The target cell's column index.
 * @param safeRow - The row index of the player's first click.
 * @param safeCol - The cell index of the player's first click. 
 * @returns true if the cell is within the safe zone and false otherwise
 */
function isSafeCell(row: number, col: number, safeRow: number, safeCol: number): boolean {
    return Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1;
}

/**
 * Updates the adjacentMines counter for cells that neighbor a mine.
 * @param board - The Minesweeper game board object.
 * @param row - The row index of the mine.
 * @param col - The col index of the mine. 
 */
function updateAdjacentMines(board: Board, row: number, col: number): void {
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
            // skips the mine cell at (row, col)
            if (rowOffset === 0 && colOffset === 0) {
                continue;
            }

            const neighborRow = row + rowOffset;
            const neighborCol = col + colOffset;

            // updates the neighboring cells to contain a +1 mine count
            if (neighborRow >= 0 && neighborRow < board.rows &&
                neighborCol >= 0 && neighborCol < board.cols) {
                board.cells[neighborRow][neighborCol].adjacentMines += 1;
            }
        }
    }
}

/**
 * Randomly places mines across the board.
 * @param board - The Minesweeper game board object.
 * @param safeRow - The row index of the player's first click.
 * @param safeCol - The cell index of the player's first click. 
 */
function placeMines(board: Board, safeRow: number, safeCol: number): void {
    let minesPlaced = 0;

    while (minesPlaced < board.mineCount) {
        // randomly generate the mine's row and col values
        const row = Math.floor(Math.random() * board.rows);
        const col = Math.floor(Math.random() * board.cols);
        const cell = board.cells[row][col];

        // only place a mine if that cell is not already a mine and not a Safe Cell (in the safe zone)
        if (cell.isMine || isSafeCell(row, col, safeRow, safeCol)) {
            continue;
        }

        cell.isMine = true;
        minesPlaced += 1;
        updateAdjacentMines(board, row, col);
    }
}

/**
 * Checks if the game is at won status and updates gameStatus to won if so.
 * 
 * To win all non mine cells must be revealed.
 * 
 * @param board - The Minesweeper game board object.
 */
function updateWinStatus(board: Board): void {
    // Edge Case: can only win the game if it's being actively played
    if (board.gameStatus !== 'playing') {
        return;
    }

    // check if every non mine cell is revealed
    const allSafeCellsRevealed = board.cells.every((row) =>
        row.every((cell) => cell.isMine || cell.state === 'revealed')
    );

    // return if not all safe cells have been revealed 
    if (!allSafeCellsRevealed) {
        return;
    }

    // update game status to won
    board.gameStatus = 'won';

    // automatically flag all remaining unflagged mines
    for (const row of board.cells) {
        for (const cell of row) {
            if (cell.isMine && cell.state === 'covered') {
                cell.state = 'flagged';
            }
        }
    }
}

/**
 * Sets the state of all mines to revealed.
 * @param board - The Minesweeper game board object.
 */
function revealAllMines(board: Board): void {
    for (const row of board.cells) {
        for (const cell of row) {
            if (cell.isMine) {
                cell.state = 'revealed';
            }
        }
    }
}

/**
 * Recursively reveals neighboring cells that contain 0 adjacent mines and their boundary cells
 * @param board - The Minesweeper game board object.
 * @param row - The row index of the mine.
 * @param col - The col index of the mine. 
 */
function revealEmptyNeighbors(board: Board, row: number, col: number): void {
    const cellsToVisit: Array<[number, number]> = [[row, col]];

    while (cellsToVisit.length > 0) {
        const [currentRow, currentCol] = cellsToVisit.pop()!;

        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                const neighborRow = currentRow + rowOffset;
                const neighborCol = currentCol + colOffset;

                // ignores invalid neighborRow or neighborCol indexes
                if (neighborRow < 0 || neighborRow >= board.rows ||
                    neighborCol < 0 || neighborCol >= board.cols) {
                    continue;
                }

                const neighbor = board.cells[neighborRow][neighborCol];

                // checks if the neighbor has already been revealed or flagged
                if (neighbor.state !== 'covered' || neighbor.isMine) {
                    continue;
                }

                neighbor.state = 'revealed';

                // update cellsToVisit if neighbor has 0 adjacent mines
                if (neighbor.adjacentMines === 0) {
                    cellsToVisit.push([neighborRow, neighborCol]);
                }
            }
        }
    }
}

/**
 * Initializes a 10x10 Minesweeper game board.
 * @param mineCount - The number of mines to add on the board. 
 * @returns A board object that is in the ready state.
 */
export function createGame(mineCount: number): Board {
    return createEmptyBoard(10, 10, mineCount, 'ready');
}

/**
 * Handles a player clicking a cell.
 * @param board - The Minesweeper game board object.
 * @param row - The row index of the mine.
 * @param col - The col index of the mine. 
 */
export function revealCell(board: Board, row: number, col: number): void {
    // exit the function if the game has already been lost or won
    if (row < 0 || row >= board.rows || col < 0 || col >= board.cols ||
        board.gameStatus === 'lost' || board.gameStatus === 'won') {
        return;
    }

    const cell = board.cells[row][col];

    // exit if the cell has already been uncovered
    if (cell.state !== 'covered') {
        return;
    }

    // on the first click, initialize mine placement and update gameStatus
    if (board.gameStatus === 'ready') {
        placeMines(board, row, col);
        board.gameStatus = 'playing';
    }

    // if a mine is clicked, end the game
    if (cell.isMine) {
        revealAllMines(board);
        board.gameStatus = 'lost';
        return;
    }

    cell.state = 'revealed';
    if (cell.adjacentMines === 0) {
        revealEmptyNeighbors(board, row, col);
    }
    updateWinStatus(board);
}

/**
 * Toggles a covered cell between convered and flagged states.
 * @param board - The Minesweeper game board object.
 * @param row - The row index of the mine.
 * @param col - The col index of the mine. 
 */
export function toggleFlag(board: Board, row: number, col: number): void {
    // exit the function if the game has already been lost or won
    if (row < 0 || row >= board.rows || col < 0 || col >= board.cols ||
        board.gameStatus === 'lost' || board.gameStatus === 'won') {
        return;
    }

    const cell = board.cells[row][col];

    if (cell.state === 'revealed') {
        return;
    }

    if (cell.state === 'flagged') {
        cell.state = 'covered';
    } else if (board.cells.flat().filter((candidate) => candidate.state === 'flagged').length < board.mineCount) {
        cell.state = 'flagged';
    }

    if (board.gameStatus === 'playing') {
        updateWinStatus(board);
    }
}
