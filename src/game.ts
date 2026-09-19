import { createEmptyBoard, type Board } from './types.js';

function isSafeCell(row: number, col: number, safeRow: number, safeCol: number): boolean {
    return Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1;
}

function updateAdjacentMines(board: Board, row: number, col: number): void {
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
            if (rowOffset === 0 && colOffset === 0) {
                continue;
            }

            const neighborRow = row + rowOffset;
            const neighborCol = col + colOffset;
            if (neighborRow >= 0 && neighborRow < board.rows &&
                neighborCol >= 0 && neighborCol < board.cols) {
                board.cells[neighborRow][neighborCol].adjacentMines += 1;
            }
        }
    }
}

function placeMines(board: Board, safeRow: number, safeCol: number): void {
    let minesPlaced = 0;

    while (minesPlaced < board.mineCount) {
        const row = Math.floor(Math.random() * board.rows);
        const col = Math.floor(Math.random() * board.cols);
        const cell = board.cells[row][col];

        if (cell.isMine || isSafeCell(row, col, safeRow, safeCol)) {
            continue;
        }

        cell.isMine = true;
        minesPlaced += 1;
        updateAdjacentMines(board, row, col);
    }
}

function updateWinStatus(board: Board): void {
    if (board.gameStatus !== 'playing') {
        return;
    }

    let flaggedCount = 0;
    let flagsAreCorrect = true;

    for (const row of board.cells) {
        for (const cell of row) {
            if (cell.state === 'flagged') {
                flaggedCount += 1;
                if (!cell.isMine) {
                    flagsAreCorrect = false;
                }
            }
        }
    }

    const allSafeCellsRevealed = board.cells.every((row) =>
        row.every((cell) => cell.isMine || cell.state === 'revealed')
    );
    const allMinesFlagged = flaggedCount === board.mineCount && flagsAreCorrect &&
        board.cells.every((row) => row.every((cell) => !cell.isMine || cell.state === 'flagged'));

    if (!allSafeCellsRevealed && !allMinesFlagged) {
        return;
    }

    board.gameStatus = 'won';
    for (const row of board.cells) {
        for (const cell of row) {
            if (cell.isMine && cell.state === 'covered') {
                cell.state = 'flagged';
            }
        }
    }
}

function revealAllMines(board: Board): void {
    for (const row of board.cells) {
        for (const cell of row) {
            if (cell.isMine) {
                cell.state = 'revealed';
            }
        }
    }
}

function revealEmptyNeighbors(board: Board, row: number, col: number): void {
    const cellsToVisit: Array<[number, number]> = [[row, col]];

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

export function createGame(mineCount: number): Board {
    return createEmptyBoard(10, 10, mineCount, 'ready');
}

export function revealCell(board: Board, row: number, col: number): void {
    if (row < 0 || row >= board.rows || col < 0 || col >= board.cols ||
        board.gameStatus === 'lost' || board.gameStatus === 'won') {
        return;
    }

    const cell = board.cells[row][col];
    if (cell.state !== 'covered') {
        return;
    }

    if (board.gameStatus === 'ready') {
        placeMines(board, row, col);
        board.gameStatus = 'playing';
    }

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

export function toggleFlag(board: Board, row: number, col: number): void {
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
    } else {
        cell.state = 'flagged';
    }

    if (board.gameStatus === 'playing') {
        updateWinStatus(board);
    }
}
