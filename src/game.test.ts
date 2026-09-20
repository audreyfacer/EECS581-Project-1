/*
 * Module: game.test.ts
 * Description: Automated behavior tests for Minesweeper game rules.
 *
 * Inputs: Game boards and coordinates created by the game module.
 * Outputs: Passing or failing assertions for core game behavior.
 *
 * Author: Ibaad Khatib, Zain Cheema, and Aiman Boullaouz
 * Creation Date: September 20, 2026
 * External Sources: Node.js built-in test and assert APIs.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createGame, revealCell, toggleFlag } from './game.js';

function flaggedCount(board: ReturnType<typeof createGame>): number {
    return board.cells.flat().filter((cell) => cell.state === 'flagged').length;
}

test('flagging is capped at the selected mine count and supports unflagging', () => {
    const board = createGame(2);

    toggleFlag(board, 0, 0);
    toggleFlag(board, 0, 1);
    toggleFlag(board, 0, 2);

    assert.equal(flaggedCount(board), 2);
    assert.equal(board.cells[0][2].state, 'covered');

    toggleFlag(board, 0, 0);
    assert.equal(flaggedCount(board), 1);
    assert.equal(board.cells[0][0].state, 'covered');
});

test('a flagged cell cannot be revealed', () => {
    const board = createGame(1);

    toggleFlag(board, 0, 0);
    revealCell(board, 0, 0);

    assert.equal(board.gameStatus, 'ready');
    assert.equal(board.cells[0][0].state, 'flagged');
});

test('the first revealed cell and its neighbors are safe', () => {
    const board = createGame(20);

    revealCell(board, 5, 5);

    assert.equal(board.gameStatus, 'playing');
    for (let row = 4; row <= 6; row += 1) {
        for (let col = 4; col <= 6; col += 1) {
            assert.equal(board.cells[row][col].isMine, false);
        }
    }
});

test('revealing a mine ends the game and reveals all mines', () => {
    const board = createGame(10);
    revealCell(board, 0, 0);
    const mine = board.cells.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => ({ cell, rowIndex, colIndex }))
    ).find(({ cell }) => cell.isMine);

    assert.ok(mine);
    revealCell(board, mine.rowIndex, mine.colIndex);

    assert.equal(board.gameStatus, 'lost');
    assert.ok(board.cells.flat().filter((cell) => cell.isMine).every((cell) => cell.state === 'revealed'));
});

test('revealing every safe cell wins the game', () => {
    const board = createGame(10);
    revealCell(board, 0, 0);

    for (let row = 0; row < board.rows; row += 1) {
        for (let col = 0; col < board.cols; col += 1) {
            if (!board.cells[row][col].isMine) {
                revealCell(board, row, col);
            }
        }
    }

    assert.equal(board.gameStatus, 'won');
    assert.ok(board.cells.flat().filter((cell) => cell.isMine).every((cell) => cell.state === 'flagged'));
});
