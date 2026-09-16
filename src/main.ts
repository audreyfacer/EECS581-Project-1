import { renderGameScreen, renderStartScreen } from './ui.js';

function showStartScreen(): void {
	renderStartScreen((mineCount) => {
		renderGameScreen(mineCount, showStartScreen);
	});
}

showStartScreen();
