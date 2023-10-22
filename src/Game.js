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

    playerDomUpdateQueue = [];
    cellDomUpdateQueue = [];

    /**
     * @param {object} board - The board object for the game.
     * @param {HTMLElement} containerEl - The container element for the game.
     */
    constructor(board, containerEl) {
        this.board = board;
        this.containerEl = containerEl;
        this.remainingObjectives = 0;
        this.moveCount = 0;
        this.gameDone = false;

        this.playerMoveEvent = new Event('playerMove');

        // Preloading map (board size and empty cells)
        this.containerEl.innerHTML = '';

        const maxX = Math.max(...this.board.cells.map((element) => element.position.x));
        const maxY = Math.max(...this.board.cells.map((element) => element.position.y));

        const rootEl = document.documentElement;
        rootEl.style.setProperty('--grid-columns', maxX + 1);
        rootEl.style.setProperty('--grid-rows', maxY + 1);

        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                const cell = new Cell('empty', x, y, this.cellDomUpdateQueue);

                this.containerEl.appendChild(cell.cellEl);
                this.cells.push(cell);
            }
        }

        this.boardFeatures.minX = 0;
        this.boardFeatures.maxX = maxX;
        this.boardFeatures.minY = 0;
        this.boardFeatures.maxY = maxY;

        // Loading cells
        this.board.cells.forEach((element) => {
            const cell = this.getCellAtCoords(element.position.x, element.position.y);
            cell.updateType(element.type, true);

            if (element.start === true) {
                const player = new Player(element.position.x, element.position.y, this.playerDomUpdateQueue);

                this.containerEl.appendChild(player.playerEl);
                this.player = player;
            } else if (element.type === 'objective') {
                this.remainingObjectives += 1;
            }
        });
    }

    /**
     * Updates the DOM with the latest changes to the game state. This method should be called in a loop.
     */
    updateDom() {
        const cellDomUpdate = this.cellDomUpdateQueue.shift();
        if (cellDomUpdate) {
            cellDomUpdate.cell.updateTypeDom(cellDomUpdate.cell.cellEl, cellDomUpdate.type);
        }

        const playerDomUpdate = this.playerDomUpdateQueue.shift();
        if (playerDomUpdate) {
            playerDomUpdate.player.moveToDom(playerDomUpdate.player.playerEl, playerDomUpdate.top, playerDomUpdate.left);
        }
    }

    /**
     * Moves the player one cell to the left and triggers the cell effect.
     *
     * @param {boolean} [collateralMove=false] - Whether this move is a collateral move (not induced by the player) or not.
     */
    movePlayerLeft(collateralMove = false) {
        if (!collateralMove) {
            this.player.positionHistory.push({
                x: this.player.x,
                y: this.player.y,
            });
        }

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

    /**
     * Moves the player one cell to the right and triggers the cell effect.
     *
     * @param {boolean} [collateralMove=false] - Whether this move is a collateral move (not induced by the player) or not.
     */
    movePlayerRight(collateralMove = false) {
        if (!collateralMove) {
            this.player.positionHistory.push({
                x: this.player.x,
                y: this.player.y,
            });
        }

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

    /**
     * Moves the player up by one cell and triggers the cell effect.
     *
     * @param {boolean} [collateralMove=false] - Whether this move is a collateral move (not induced by the player) or not.
     */
    movePlayerUp(collateralMove = false) {
        if (!collateralMove) {
            this.player.positionHistory.push({
                x: this.player.x,
                y: this.player.y,
            });
        }

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

    /**
     * Moves the player down by one cell and triggers the cell effect.
     *
     * @param {boolean} [collateralMove=false] - Whether this move is a collateral move (not induced by the player) or not.
     */
    movePlayerDown(collateralMove = false) {
        if (!collateralMove) {
            this.player.positionHistory.push({
                x: this.player.x,
                y: this.player.y,
            });
        }

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

    /**
     * Triggers the effect of the current cell based on its type.
     */
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
        } else if (currentCell.type === 'checkpoint' || currentCell.type === 'start') {
            this.triggerCheckpointCellEffect(currentCell);
        }
    }

    /**
     * Triggers the yellow cell effect (becomes red and moves the player one cell further).
     *
     * @param {Cell} cell - The cell to trigger the effect on.
     */
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

    /**
     * Triggers the green cell effect (becomes yellow and moves the player to its previous cell, collateral moves not included).
     *
     * @param {Cell} cell - The cell to trigger the effect on.
     */
    triggerGreenCellEffect(cell) {
        cell.rotateType();

        const lastPosition = this.player.positionHistory.pop();

        if (this.player.x < lastPosition.x) {
            this.movePlayerRight(true);
        } else if (this.player.x > lastPosition.x) {
            this.movePlayerLeft(true);
        } else if (this.player.y < lastPosition.y) {
            this.movePlayerDown(true);
        } else if (this.player.y > lastPosition.y) {
            this.movePlayerUp(true);
        }
    }

    /**
     * Triggers the red cell effect (becomes green and changes the cell's color on contact: Yellow -> Red -> Green -> Black -> Yellow).
     *
     * @param {Cell} cell - The cell to trigger the effect on.
     */
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

        const rightCell = this.getCellAtCoords(cell.x + 1, cell.y, true);
        if (rightCell) {
            rightCell.updateType(redCellTypeRotation[rightCell.type]);
        }

        const belowCell = this.getCellAtCoords(cell.x, cell.y + 1, true);
        if (belowCell) {
            belowCell.updateType(redCellTypeRotation[belowCell.type]);
        }

        const leftCell = this.getCellAtCoords(cell.x - 1, cell.y, true);
        if (leftCell) {
            leftCell.updateType(redCellTypeRotation[leftCell.type]);
        }
    }

    /**
     * Triggers the black cell effect (becomes red and moves the player to the last colorless cell crossed).
     *
     * @param {Cell} cell - The cell to trigger the effect on.
     */
    triggerBlackCellEffect(cell) {
        cell.rotateType();

        this.player.moveTo(this.player.checkpointX, this.player.checkpointY);
    }

    /**
     * Triggers the objective cell effect (becomes colorless and validates an objective).
     *
     * @param {Cell} cell - The cell to trigger the effect on.
     */
    triggerObjectiveCellEffect(cell) {
        cell.updateType('checkpoint');

        this.player.setCheckpoint(cell.x, cell.y);
        this.remainingObjectives -= 1;

        if (this.remainingObjectives === 0) {
            this.gameDone = true;
        }
    }

    /**
     * Triggers the checkpoint cell effect (set player's checkpoint position).
     *
     * @param {Cell} cell - The cell to trigger the effect on.
     */
    triggerCheckpointCellEffect(cell) {
        this.player.setCheckpoint(cell.x, cell.y);
    }

    /**
     * Returns the cell object at the given coordinates.
     *
     * @param {number} x - The x-coordinate of the cell.
     * @param {number} y - The y-coordinate of the cell.
     * @param {boolean} [variableCellOnly=false] - If true, only returns variable cells (Yellow, Green, Black or Red).
     *
     * @returns {(Cell|undefined)} - The cell object at the given coordinates.
     */
    getCellAtCoords(x, y, variableCellOnly = false) {
        if (variableCellOnly === true) {
            return this.cells.find((cell) => cell.x === x && cell.y === y && VARIABLE_CELL_TYPES.includes(cell.type));
        }

        return this.cells.find((cell) => cell.x === x && cell.y === y);
    }

    /**
     * Checks if the player can move to the given coordinates.
     *
     * @param {number} x - The x-coordinate to check.
     * @param {number} y - The y-coordinate to check.
     *
     * @returns {boolean} - Returns true if the player can move to the given coordinates, false otherwise.
     */
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
