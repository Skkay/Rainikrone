import Cell from './Cell';
import Player from './Player';

class Game {
    cells = [];
    board;
    containerEl;
    player;

    constructor(board, containerEl) {
        this.board = board;
        this.containerEl = containerEl;
    }

    bootstrap() {
        const maxX = Math.max(...this.board.cells.map((element) => element.position.x));
        const maxY = Math.max(...this.board.cells.map((element) => element.position.y));

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

    init() {
        this.board.cells.forEach((element) => {
            const cell = this.cells.find((a) => {
                return a.x === element.position.x && a.y === element.position.y;
            });

            cell.updateType(element.type);

            if (element.type === 'start') {
                const player = new Player(element.position.x, element.position.y);

                this.containerEl.appendChild(player.playerEl);
                this.player = player;
            }
        });
    }
}

export default Game;
