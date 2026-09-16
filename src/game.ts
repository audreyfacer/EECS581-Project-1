import { inBounds } from './types.js';
import type { Board, GameState } from './types.js';

export function revealCell(gameState: GameState, row: number, column: number): void {
	if (gameState.status === 'won' || gameState.status === 'lost') {
		return;
	}

	const coordinate = { row, col: column };
	if (!inBounds(gameState.board, coordinate)) {
		return;
	}

	if (gameState.status === 'ready') {
		placeMines(gameState.board, row, column);
		gameState.status = 'playing';
	}

	const cell = gameState.board.cells[row][column];
	if (cell === undefined || cell.state !== 'covered') {
		return;
	}

	if (cell.isMine) {
		cell.state = 'revealed';
		gameState.status = 'lost';
		return;
	}

	floodReveal(gameState.board, row, column);
	if (hasWon(gameState.board)) {
		gameState.status = 'won';
	}
}

export function toggleFlag(gameState: GameState, row: number, column: number): void {
	if (gameState.status === 'won' || gameState.status === 'lost') {
		return;
	}

	const cell = gameState.board.cells[row]?.[column];
	if (cell === undefined || cell.state === 'revealed') {
		return;
	}

	if (cell.state === 'flagged') {
		cell.state = 'covered';
		gameState.flagsPlaced -= 1;
	} else if (gameState.flagsPlaced < gameState.board.mineCount) {
		cell.state = 'flagged';
		gameState.flagsPlaced += 1;
	}
}

function placeMines(board: Board, safeRow: number, safeColumn: number): void {
	const candidates: Array<{ row: number; column: number }> = [];

	for (let row = 0; row < board.rows; row += 1) {
		for (let column = 0; column < board.cols; column += 1) {
			if (row !== safeRow || column !== safeColumn) {
				candidates.push({ row, column });
			}
		}
	}

	for (let index = candidates.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
	}

	for (let index = 0; index < board.mineCount; index += 1) {
		const candidate = candidates[index];
		if (candidate !== undefined) {
			board.cells[candidate.row][candidate.column].isMine = true;
		}
	}

	for (let row = 0; row < board.rows; row += 1) {
		for (let column = 0; column < board.cols; column += 1) {
			board.cells[row][column].adjacentMines = countAdjacentMines(board, row, column);
		}
	}
}

function floodReveal(board: Board, startRow: number, startColumn: number): void {
	const pending = [{ row: startRow, column: startColumn }];

	while (pending.length > 0) {
		const coordinate = pending.pop();
		if (coordinate === undefined) {
			continue;
		}

		const cell = board.cells[coordinate.row][coordinate.column];
		if (cell.state !== 'covered' || cell.isMine) {
			continue;
		}

		cell.state = 'revealed';
		if (cell.adjacentMines !== 0) {
			continue;
		}

		for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
			for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
				const row = coordinate.row + rowOffset;
				const column = coordinate.column + columnOffset;
				if (inBounds(board, { row, col: column })) {
					pending.push({ row, column });
				}
			}
		}
	}
}

function countAdjacentMines(board: Board, row: number, column: number): number {
	let count = 0;

	for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
		for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
			const adjacentRow = row + rowOffset;
			const adjacentColumn = column + columnOffset;
			if (
				inBounds(board, { row: adjacentRow, col: adjacentColumn }) &&
				board.cells[adjacentRow][adjacentColumn].isMine
			) {
				count += 1;
			}
		}
	}

	return count;
}

function hasWon(board: Board): boolean {
	return board.cells.every((row) =>
		row.every((cell) => cell.isMine || cell.state === 'revealed')
	);
}
