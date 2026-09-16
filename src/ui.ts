import type { Board, Cell, GameState, GameStatus } from './types.js';

const statusLabels: Record<GameStatus, string> = {
  ready: 'Ready to play',
  playing: 'In progress',
  won: 'You win!',
  lost: 'Game over',
};

export function renderGame(gameState: GameState): void {
  renderBoard(gameState.board, gameState.status);

  const controls = document.getElementById('controls');
  if (controls !== null) {
    const remaining = gameState.board.mineCount - gameState.flagsPlaced;
    controls.textContent = `Mines: ${remaining} / ${gameState.board.mineCount}`;
    controls.className = 'mine-counter';
    controls.setAttribute('aria-live', 'polite');
  }

  const status = document.getElementById('status');
  if (status !== null) {
    status.textContent = statusLabels[gameState.status];
    status.className = `status status-${gameState.status}`;
    status.setAttribute('aria-live', 'polite');
  }
}

export function renderBoard(board: Board, gameStatus: GameStatus = 'playing'): void {
  const boardElement = document.getElementById('board');
  if (boardElement === null) {
    return;
  }

  boardElement.replaceChildren();
  boardElement.className = `board board-${board.rows}x${board.cols}`;
  boardElement.setAttribute('role', 'grid');
  boardElement.setAttribute('aria-label', `${board.rows} by ${board.cols} Minesweeper board`);
  boardElement.style.gridTemplateColumns = `repeat(${board.cols}, 1fr)`;

  for (let row = 0; row < board.rows; row += 1) {
    for (let column = 0; column < board.cols; column += 1) {
      const cell = board.cells[row][column];
      if (cell !== undefined) {
        boardElement.appendChild(createCell(cell, row, column, gameStatus));
      }
    }
  }
}

function createCell(cellData: Cell, row: number, column: number, gameStatus: GameStatus): HTMLDivElement {
  const cell = document.createElement('div');
  const showMine = cellData.isMine && (gameStatus === 'lost' || cellData.state === 'revealed');

  cell.className = `cell cell-${cellData.state}`;
  cell.setAttribute('role', 'gridcell');
  cell.setAttribute('aria-rowindex', String(row + 1));
  cell.setAttribute('aria-colindex', String(column + 1));
  cell.dataset.row = String(row);
  cell.dataset.column = String(column);
  cell.dataset.state = cellData.state;

  if (showMine) {
    cell.classList.add('cell-mine');
    if (gameStatus === 'lost') {
      cell.classList.add('cell-exploded');
    }
    cell.textContent = 'X';
    cell.setAttribute('aria-label', gameStatus === 'lost' ? 'Exploded mine' : 'Mine');
  } else if (cellData.state === 'flagged') {
    cell.textContent = 'F';
    cell.setAttribute('aria-label', 'Flagged cell');
  } else if (cellData.state === 'revealed' && cellData.adjacentMines > 0) {
    cell.textContent = String(cellData.adjacentMines);
    cell.setAttribute('aria-label', `${cellData.adjacentMines} adjacent mines`);
  } else if (cellData.state === 'revealed') {
    cell.setAttribute('aria-label', 'Revealed empty cell');
  } else {
    cell.setAttribute('aria-label', 'Covered cell');
  }

  return cell;
}