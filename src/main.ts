/**
 * Module: ui.ts
 * Description: 
 *
 * Inputs: 
 * Outputs: 
 *
 * Author: 
 * Creation Date: 
 * External Sources:
 */
// imports the render functions from the ui module to display the start and game screens.
import { renderGameScreen, renderStartScreen } from './ui.js';

// Displays the start screen and sets up the callback to transition to the game screen.
function showStartScreen(): void { 
	renderStartScreen((mineCount) => {
		renderGameScreen(mineCount, showStartScreen);
	});
}

showStartScreen(); // Initiates the Minesweeper game by displaying the start screen.
