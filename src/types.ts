/*
 * Module: types.ts
 * Description: Defines the shared data model for the Minesweeper board,
 * including cells, the board array, row/column labels, game status,
 * mine counts, and flag metadata.
 *
 * Inputs: None. This module performs no user input or external I/O.
 * Outputs: Exported types, constants, and helper functions used by
 * other Minesweeper modules. No side effects.
 *
 * Author: Alice Mungamuri & Audrey Facer
 * Creation Date: September 15, 2026
 * External Sources: Copilot and other tools were used in this file 
 */

// Board configuration constants.
export const BOARD_SIZE = 10;
export const MIN_MINES = 10;
export const MAX_MINES = 20;

// Labels displayed to the player for the 10x10 board.
export const COLUMN_LABELS = [
  'A', 'B', 'C', 'D', 'E',
  'F', 'G', 'H', 'I', 'J'
] as const;

export const ROW_LABELS = [
  1, 2, 3, 4, 5,
  6, 7, 8, 9, 10
] as const;

// Coordinates are 0-indexed internally; labels are only used for display.
export type Coord = {
  row: number;
  col: number;
};

// A cell has exactly one state so it cannot be both flagged and revealed.
export type CellState = 'covered' | 'flagged' | 'revealed';

// Represents one square on the Minesweeper board.
// adjacentMines remains 0 until the game logic calculates neighboring mines.
export type Cell = {
  isMine: boolean;
  adjacentMines: number;
  state: CellState;
};

// Represents the complete Minesweeper board and its dimensions.
// Access cells using cells[row][col]: row 0 displays as row 1,
// and col 0 displays as column A.
// Consumers should bounds-check coordinates before accessing cells.
export type Board = {
  cells: Cell[][];
  rows: number;
  cols: number;
  mineCount: number;
  gameStatus: GameStatus;
};

// "ready" means mines have not been placed yet so the first click can be safe.
// "playing" begins after the player's first reveal.
export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

// Tracks the overall state of the game.
// Remaining mines are calculated as board.mineCount - flagsPlaced.
// flagsPlaced must not exceed board.mineCount; game logic should reject
// attempts to place additional flags when no flags remain.
export type GameState = {
  board: Board;
  status: GameStatus;
  flagsPlaced: number;
};

// Creates an empty board containing independent rows and cells.
// Mine placement and adjacent-mine calculations are handled by game logic.
export function createEmptyBoard(
  rows: number,
  cols: number,
  mineCount: number,
  gameStatus: GameStatus
): Board {
  const cells: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (): Cell => ({
      isMine: false,
      adjacentMines: 0,
      state: 'covered',
    }))
  );

  return {
    cells,
    rows,
    cols,
    mineCount,
    gameStatus
  };
}

// Returns true when the coordinate exists within the board.
export function inBounds(board: Board, coord: Coord): boolean {
  return (
    coord.row >= 0 &&
    coord.row < board.rows &&
    coord.col >= 0 &&
    coord.col < board.cols
  );
}

// Converts a 0-indexed coordinate into a display label such as "A1".
export function coordToLabel(coord: Coord): string {
  const column = String.fromCharCode('A'.charCodeAt(0) + coord.col);
  return `${column}${coord.row + 1}`;
}