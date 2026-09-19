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

function showWinCelebration(app: HTMLElement): void {
    const celebration = createElement('div', 'win-celebration');
    const message = createElement('div', 'win-celebration-message', 'YOU WIN');
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    celebration.append(canvas, message);
    app.append(celebration);

    const context = canvas.getContext('2d');
    if (!context) {
        return;
    }

    const colors = ['#ff8ad8', '#d8a7ff', '#a9e5ff', '#fff0a6'];
    const particles = Array.from({ length: 180 }, () => ({
        x: Math.random() * window.innerWidth,
        y: -Math.random() * window.innerHeight,
        size: 5 + Math.random() * 7,
        speed: 2 + Math.random() * 4,
        drift: (Math.random() - 0.5) * 2,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const resizeCanvas = (): void => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (): void => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (const particle of particles) {
            context.save();
            context.translate(particle.x, particle.y);
            context.rotate(particle.rotation);
            context.fillStyle = particle.color;
            context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.65);
            context.restore();
            particle.y += particle.speed;
            particle.x += particle.drift;
            particle.rotation += particle.rotationSpeed;
        }

        if (particles.some((particle) => particle.y < canvas.height + 20)) {
            window.requestAnimationFrame(animate);
        } else {
            window.removeEventListener('resize', resizeCanvas);
        }
    };
    window.requestAnimationFrame(animate);
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
    const gameMessage = createElement('div', 'game-message');
    const boardHost = createElement('div', 'board-host');
    const boardFrame = createElement('section', 'board-frame');
    let celebrationShown = false;
    const updateGameView = (): void => {
        stats.innerHTML = `<div><span>Mines</span><strong>${gameBoard.mineCount}</strong></div><button class="new-game-button" type="button">New game</button>`;
        stats.querySelector<HTMLButtonElement>('.new-game-button')?.addEventListener('click', onNewGame);
        gameMessage.textContent = gameBoard.gameStatus === 'won'
            ? 'YOU WIN'
            : gameBoard.gameStatus === 'lost'
                ? 'GAME OVER'
                : '';
        gameMessage.className = `game-message ${gameBoard.gameStatus}`;
        if (gameBoard.gameStatus === 'won' && !celebrationShown) {
            celebrationShown = true;
            showWinCelebration(app);
        }
        boardHost.replaceChildren(renderBoard(gameBoard, updateGameView));
    };
    updateGameView();
    boardFrame.append(stats, gameMessage, boardHost);
    gameShell.append(gameHeading, boardFrame);
    app.append(gameShell);
}

