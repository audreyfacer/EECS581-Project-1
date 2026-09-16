import { createEmptyBoard } from './types.js';
import { revealCell, toggleFlag } from './game.js';
import { renderGame } from './ui.js';

const gameState = {
	board: createEmptyBoard(10, 10, 10),
	status: 'ready' as const,
	flagsPlaced: 0,
};

renderGame(gameState);

const boardElement = document.getElementById('board');
boardElement?.addEventListener('click', (event) => {
	const cell = (event.target as HTMLElement).closest<HTMLElement>('.cell');
	if (cell === null) {
		return;
	}

	revealCell(gameState, Number(cell.dataset.row), Number(cell.dataset.column));
	renderGame(gameState);
});

boardElement?.addEventListener('contextmenu', (event) => {
	event.preventDefault();
	const cell = (event.target as HTMLElement).closest<HTMLElement>('.cell');
	if (cell === null) {
		return;
	}

	toggleFlag(gameState, Number(cell.dataset.row), Number(cell.dataset.column));
	renderGame(gameState);
});
