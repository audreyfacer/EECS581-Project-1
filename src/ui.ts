import { createGame, revealCell, toggleFlag } from './game.js';
import { BOARD_SIZE, MAX_MINES, MIN_MINES, type Board } from './types.js';

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
    document.body.classList.add('start-page');
    document.body.classList.remove('game-page');

    const shell = createElement('div', 'start-shell');
    const intro = createElement('section', 'start-intro');
    const title = createElement('h1', 'brand-title', 'Minesweeper');
    intro.append(title);

    const setup = createElement('section', 'setup-panel');
    const setupHeading = createElement('h2', 'panel-title', 'Choose mines');
    const minePicker = createElement('label', 'mine-picker');
    const mineReadout = createElement('div', 'mine-readout');
    const mineCount = createElement('output', 'mine-count', '15');
    const mineLabel = createElement('span', 'mine-label', 'mines');
    const mineRange = document.createElement('input');
    mineRange.type = 'range';
    mineRange.min = String(MIN_MINES);
    mineRange.max = String(MAX_MINES);
    mineRange.value = '15';
    mineRange.setAttribute('aria-label', 'Number of mines slider');
    mineRange.addEventListener('input', () => {
        mineCount.textContent = mineRange.value;
    });
    mineReadout.append(mineCount, mineLabel);
    minePicker.append(mineReadout, mineRange);

    const startButton = createElement('button', 'start-button', 'Start game');
    startButton.type = 'button';
    startButton.addEventListener('click', () => onStart(Number(mineRange.value)));
    const instructions = createElement('div', 'instructions');
    instructions.innerHTML = '<span class="instruction-icon">?</span><div><strong>How to play</strong><ul><li>Reveal every safe square.</li><li>Use numbers to spot nearby mines.</li><li>Right-click to flag a suspected mine.</li></ul></div>';
    setup.append(setupHeading, minePicker, startButton, instructions);
    shell.append(intro, setup);
    app.append(shell);
}

function renderBoard(boardData: Board, onUpdate: () => void): HTMLElement {
    const board = createElement('div', 'board');
    board.id = 'board';

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let column = 0; column < BOARD_SIZE; column++) {
            const cell = document.createElement('div');

            cell.className = 'cell';

            const cellData = boardData.cells[row][column];
            if (cellData.state === 'revealed') {
                cell.classList.add('revealed');
                if (cellData.isMine) {
                    cell.textContent = '*';
                    cell.classList.add('mine');
                } else if (cellData.adjacentMines > 0) {
                    cell.textContent = String(cellData.adjacentMines);
                    cell.classList.add(`number-${cellData.adjacentMines}`);
                }
            } else if (cellData.state === 'flagged') {
                cell.textContent = '⚑';
                cell.classList.add('flagged');
            }
            cell.setAttribute('aria-label', cellData.state === 'flagged' ? 'flagged square' : 'covered square');
            cell.addEventListener('click', () => {
                revealCell(boardData, row, column);
                onUpdate();
            });
            cell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                toggleFlag(boardData, row, column);
                onUpdate();
            });
            board.append(cell);
        }
    }
    return board;
}

export function renderGameScreen(mineCount: number, onNewGame: NewGameHandler): void {
    const app = getApp();
    app.replaceChildren();
    document.body.classList.add('game-page');
    document.body.classList.remove('start-page');
    window.scrollTo(0, 0);

    const gameBoard = createGame(mineCount);
    const gameShell = createElement('div', 'game-shell');

    const gameHeading = createElement('div', 'game-heading');
    gameHeading.innerHTML = '<h1>Find the safe squares</h1>';
    const stats = createElement('div', 'game-stats');
    const boardHost = createElement('div', 'board-host');
    const boardFrame = createElement('section', 'board-frame');
    const updateGameView = (): void => {
        stats.innerHTML = `<div><span>Mines</span><strong>${gameBoard.mineCount}</strong></div><button class="new-game-button" type="button">New game</button>`;
        stats.querySelector<HTMLButtonElement>('.new-game-button')?.addEventListener('click', onNewGame);
        boardHost.replaceChildren(renderBoard(gameBoard, updateGameView));
    };
    updateGameView();
    boardFrame.append(stats, boardHost);
    gameShell.append(gameHeading, boardFrame);
    app.append(gameShell);
}

