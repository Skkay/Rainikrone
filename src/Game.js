import Cell from './Cell';
import Player from './Player';

const VARIABLE_CELL_TYPES = ['red', 'yellow', 'black', 'green'];

class Game {
    cells = [];
    board;
    containerEl;
    player;
    boardFeatures = {};
    remainingObjectives;
    moveCount;
    gameDone;

    constructor(board, containerEl) {
        this.board = board;
        this.containerEl = containerEl;
        this.remainingObjectives = 0;
        this.moveCount = 0;
        this.gameDone = false;

        this.playerMoveEvent = new Event('playerMove');
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
            } else if (element.type === 'objective') {
                this.remainingObjectives += 1;
            }
        });
    }

    movePlayerLeft(collateralMove = false) {
        const destX = this.player.x - 1;
        const destY = this.player.y;

        if (this.gameDone || !this.canPlayerMoveTo(destX, destY)) {
            return;
        }

        this.player.moveTo(destX, destY);
        this.triggerCellEffect();

        if (!collateralMove) {
            this.moveCount += 1;
            document.dispatchEvent(this.playerMoveEvent);
        }
    }

    movePlayerRight(collateralMove = false) {
        const destX = this.player.x + 1;
        const destY = this.player.y;

        if (this.gameDone || !this.canPlayerMoveTo(destX, destY)) {
            return;
        }

        this.player.moveTo(destX, destY);
        this.triggerCellEffect();

        if (!collateralMove) {
            this.moveCount += 1;
            document.dispatchEvent(this.playerMoveEvent);
        }
    }

    movePlayerUp(collateralMove = false) {
        const destX = this.player.x;
        const destY = this.player.y - 1;

        if (this.gameDone || !this.canPlayerMoveTo(destX, destY)) {
            return;
        }

        this.player.moveTo(destX, destY);
        this.triggerCellEffect();

        if (!collateralMove) {
            this.moveCount += 1;
            document.dispatchEvent(this.playerMoveEvent);
        }
    }

    movePlayerDown(collateralMove = false) {
        const destX = this.player.x;
        const destY = this.player.y + 1;

        if (this.gameDone || !this.canPlayerMoveTo(destX, destY)) {
            return;
        }

        this.player.moveTo(destX, destY);
        this.triggerCellEffect();

        if (!collateralMove) {
            this.moveCount += 1;
            document.dispatchEvent(this.playerMoveEvent);
        }
    }

    triggerCellEffect() {
        const currentCell = this.getCellAtCoords(this.player.x, this.player.y);

        if (currentCell.type === 'yellow') {
            this.triggerYellowCellEffect(currentCell);
        } else if (currentCell.type === 'green') {
            this.triggerGreenCellEffect(currentCell);
        } else if (currentCell.type === 'red') {
            this.triggerRedCellEffect(currentCell);
        } else if (currentCell.type === 'black') {
            this.triggerBlackCellEffect(currentCell);
        } else if (currentCell.type === 'objective') {
            this.triggerObjectiveCellEffect(currentCell);
        }
    }

    triggerYellowCellEffect(cell) {
        cell.rotateType();

        if (this.player.x < this.player.previousX) {
            this.movePlayerLeft(true);
        } else if (this.player.x > this.player.previousX) {
            this.movePlayerRight(true);
        } else if (this.player.y < this.player.previousY) {
            this.movePlayerUp(true);
        } else if (this.player.y > this.player.previousY) {
            this.movePlayerDown(true);
        }
    }

    triggerGreenCellEffect(cell) {
        cell.rotateType();

        if (this.player.x < this.player.previousX) {
            this.movePlayerRight(true);
        } else if (this.player.x > this.player.previousX) {
            this.movePlayerLeft(true);
        } else if (this.player.y < this.player.previousY) {
            this.movePlayerDown(true);
        } else if (this.player.y > this.player.previousY) {
            this.movePlayerUp(true);
        }
    }

    triggerRedCellEffect(cell) {
        cell.rotateType();

        const redCellTypeRotation = {
            yellow: 'red',
            red: 'green',
            green: 'black',
            black: 'yellow',
        };

        const aboveCell = this.getCellAtCoords(cell.x, cell.y - 1, true);
        if (aboveCell) {
            aboveCell.updateType(redCellTypeRotation[aboveCell.type]);
        }

        const belowCell = this.getCellAtCoords(cell.x, cell.y + 1, true);
        if (belowCell) {
            belowCell.updateType(redCellTypeRotation[belowCell.type]);
        }

        const leftCell = this.getCellAtCoords(cell.x - 1, cell.y, true);
        if (leftCell) {
            leftCell.updateType(redCellTypeRotation[leftCell.type]);
        }

        const rightCell = this.getCellAtCoords(cell.x + 1, cell.y, true);
        if (rightCell) {
            rightCell.updateType(redCellTypeRotation[rightCell.type]);
        }
    }

    triggerBlackCellEffect(cell) {
        cell.rotateType();

        this.player.moveTo(this.player.checkpointX, this.player.checkpointY);
    }

    triggerObjectiveCellEffect(cell) {
        cell.updateType('empty');

        this.player.setCheckpoint(cell.x, cell.y);
        this.remainingObjectives -= 1;

        if (this.remainingObjectives === 0) {
            this.gameDone = true;
        }
    }

    getCellAtCoords(x, y, variableCellOnly = false) {
        if (variableCellOnly === true) {
            return this.cells.find((cell) => cell.x === x && cell.y === y && VARIABLE_CELL_TYPES.includes(cell.type));
        }

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
