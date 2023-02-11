import Cell from './Cell';
import Player from './Player';

class Game {
    cells = [];
    board;
    containerEl;
    player;
    boardFeatures = {};

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

        this.boardFeatures.minX = 0;
        this.boardFeatures.maxX = maxX;
        this.boardFeatures.minY = 0;
        this.boardFeatures.maxY = maxY;
    }

    init() {
        this.board.cells.forEach((element) => {
            const cell = this.getCellAtCoords(element.position.x, element.position.y);
            cell.updateType(element.type);

            if (element.type === 'start') {
                const player = new Player(element.position.x, element.position.y);

                this.containerEl.appendChild(player.playerEl);
                this.player = player;
            }
        });
    }

    movePlayerLeft() {
        const destX = this.player.x - 1;
        const destY = this.player.y;

        if (!this.canPlayerMoveTo(destX, destY)) {
            return;
        }

        this.player.moveTo(destX, destY);
        this.triggerCellEffect();
    }

    movePlayerRight() {
        const destX = this.player.x + 1;
        const destY = this.player.y;

        if (!this.canPlayerMoveTo(destX, destY)) {
            return;
        }

        this.player.moveTo(destX, destY);
        this.triggerCellEffect();
    }

    movePlayerUp() {
        const destX = this.player.x;
        const destY = this.player.y - 1;

        if (!this.canPlayerMoveTo(destX, destY)) {
            return;
        }

        this.player.moveTo(destX, destY);
        this.triggerCellEffect();
    }

    movePlayerDown() {
        const destX = this.player.x;
        const destY = this.player.y + 1;

        if (!this.canPlayerMoveTo(destX, destY)) {
            return;
        }

        this.player.moveTo(destX, destY);
        this.triggerCellEffect();
    }

    triggerCellEffect() {
        const currentCell = this.getCellAtCoords(this.player.x, this.player.y);

        if (currentCell.type === 'yellow') {
            this.triggerYellowCellEffect();
        }
    }

    triggerYellowCellEffect() {
        if (this.player.x < this.player.previousX) {
            this.movePlayerLeft();
        } else if (this.player.x > this.player.previousX) {
            this.movePlayerRight();
        } else if (this.player.y < this.player.previousY) {
            this.movePlayerUp();
        } else if (this.player.y > this.player.previousY) {
            this.movePlayerDown();
        }
    }

    getCellAtCoords(x, y) {
        return this.cells.find((cell) => cell.x === x && cell.y === y);
    }

    canPlayerMoveTo(x, y) {
        // Check if position is out of boundaries
        if (x < this.boardFeatures.minX || y < this.boardFeatures.minY || x > this.boardFeatures.maxX || y > this.boardFeatures.maxY) {
            return false;
        }

        // Check if cell at coords is an obstacle
        const cell = this.getCellAtCoords(x, y);
        if (cell.type === 'obstacle') {
            return false;
        }

        return true;
    }
}

export default Game;
