//temp board 
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

function renderBoard(boardData: number[][]): void { //temp function header until we get board the board data 
    const board = document.getElementById("board");

    if (board === null) {
        return;
    }

    for (let row = 0; row < 10; row++) {
        for (let column = 0; column < 10; column++) {
            const cell = document.createElement("div");

            cell.className = "cell";

            const value = boardData[row][column];
            if (value > 0){
                cell.textContent = String(value);
            }
            

            board.appendChild(cell);
        }
    }
}

renderBoard(mockBoard); //temp place holder to render board 

