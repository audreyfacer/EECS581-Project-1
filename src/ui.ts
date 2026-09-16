import { BOARD_SIZE, MAX_MINES, MIN_MINES } from './types.js';

const mockBoard = [
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

type StartGameHandler = (mineCount: number) => void;
type NewGameHandler = () => void;

function getApp(): HTMLElement {
    const app = document.getElementById('app');
    if (!app) {
        throw new Error('App container was not found.');
    }
    return app;
}

function createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    className: string,
    text?: string
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    element.className = className;
    if (text) {
        element.textContent = text;
    }
    return element;
}

export function renderStartScreen(onStart: StartGameHandler): void {
    const app = getApp();
    app.replaceChildren();

    const shell = createElement('div', 'start-shell');
    const intro = createElement('section', 'start-intro');
    const title = createElement('h1', 'brand-title', 'Minesweeper');
    intro.append(title);

    const setup = createElement('section', 'setup-panel');
    const setupHeading = createElement('h2', 'panel-title', 'Choose mines');
    const setupCopy = createElement('p', 'panel-copy', 'Set the challenge, then start the game.');
    const minePicker = createElement('label', 'mine-picker');
    minePicker.innerHTML = '<span>MINES IN PLAY</span>';
    const mineInput = document.createElement('input');
    mineInput.type = 'number';
    mineInput.min = String(MIN_MINES);
    mineInput.max = String(MAX_MINES);
    mineInput.value = '15';
    mineInput.setAttribute('aria-label', 'Number of mines');
    const mineRange = document.createElement('input');
    mineRange.type = 'range';
    mineRange.min = String(MIN_MINES);
    mineRange.max = String(MAX_MINES);
    mineRange.value = mineInput.value;
    mineRange.setAttribute('aria-label', 'Number of mines slider');
    mineInput.addEventListener('input', () => {
        const value = Math.min(MAX_MINES, Math.max(MIN_MINES, Number(mineInput.value) || MIN_MINES));
        mineInput.value = String(value);
        mineRange.value = String(value);
    });
    mineRange.addEventListener('input', () => {
        mineInput.value = mineRange.value;
    });
    minePicker.append(mineInput, mineRange);

    const startButton = createElement('button', 'start-button', 'Start game');
    startButton.type = 'button';
    startButton.addEventListener('click', () => onStart(Math.min(MAX_MINES, Math.max(MIN_MINES, Number(mineInput.value) || MIN_MINES))));
    const instructions = createElement('div', 'instructions');
    instructions.innerHTML = '<span class="instruction-icon">?</span><div><strong>How to play</strong><ul><li>Reveal every safe square.</li><li>Use numbers to spot nearby mines.</li><li>Right-click to flag a suspected mine.</li></ul></div>';
    setup.append(setupHeading, setupCopy, minePicker, startButton, instructions);
    shell.append(intro, setup);
    app.append(shell);
}

function renderBoard(boardData: number[][]): HTMLElement {
    const board = createElement('div', 'board');
    board.id = 'board';

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let column = 0; column < BOARD_SIZE; column++) {
            const cell = document.createElement('div');

            cell.className = 'cell';

            const value = boardData[row][column];
            if (value > 0) {
                cell.textContent = String(value);
                cell.classList.add(`number-${value}`);
            }
            cell.setAttribute('aria-label', value > 0 ? `${value} adjacent mines` : 'covered square');
            board.append(cell);
        }
    }
    return board;
}

export function renderGameScreen(mineCount: number, onNewGame: NewGameHandler): void {
    const app = getApp();
    app.replaceChildren();

    const gameShell = createElement('div', 'game-shell');
    const topbar = createElement('header', 'game-topbar');
    const logo = createElement('div', 'mini-logo', 'Minesweeper');
    const newGame = createElement('button', 'new-game-button', 'New game');
    newGame.type = 'button';
    newGame.addEventListener('click', onNewGame);
    topbar.append(logo, newGame);

    const gameHeading = createElement('div', 'game-heading');
    gameHeading.innerHTML = `<p class="eyebrow">FIELD READY</p><h1>Find the quiet squares.</h1><p>Read the clues, trust your logic, and leave the mines untouched.</p>`;
    const stats = createElement('div', 'game-stats');
    stats.innerHTML = `<div><span>Mines</span><strong>◈ ${mineCount}</strong></div><div><span>Status</span><strong class="status-ready">Ready</strong></div>`;
    const boardFrame = createElement('section', 'board-frame');
    boardFrame.append(stats, renderBoard(mockBoard));
    gameShell.append(topbar, gameHeading, boardFrame);
    app.append(gameShell);
}

