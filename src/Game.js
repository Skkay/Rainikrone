import Cell from './Cell';

class Game {
    cells = [];
    board;
    containerEl;

    constructor(board, containerEl) {
        this.board = board;
        this.containerEl = containerEl;
    }

    bootstrap() {
        // find max x and max y in board
        const maxX = 10;
        const maxY = 10;

        const rootEl = document.documentElement;
        rootEl.style.setProperty('--grid-columns', maxX + 1);
        rootEl.style.setProperty('--grid-rows', maxY + 1);

        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                const cell = new Cell('empty', x, y);

                this.containerEl.appendChild(cell.cellEl);
                this.cells.push(cell);
            }
        }
    }
}

export default Game;
