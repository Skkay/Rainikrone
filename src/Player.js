const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;
const PLAYER_WIDTH = 34;
const PLAYER_HEIGHT = 34;
const BOARD_PADDING = 5;
const GRID_GAP = 2;

class Player {
    previousX;
    previousY;
    x;
    y;
    playerEl;
    checkpointX;
    checkpointY;
    positionHistory = [];

    domUpdateQueue = [];

    /**
     * @param {number} startX - The starting x-coordinate of the player.
     * @param {number} startY - The starting y-coordinate of the player.
     * @param {Array} domUpdateQueue - The queue of DOM updates to perform.
     */
    constructor(startX, startY, domUpdateQueue) {
        const playerEl = document.createElement('div');
        playerEl.setAttribute('id', 'player');

        this.playerEl = playerEl;
        this.checkpointX = startX;
        this.checkpointY = startY;
        this.domUpdateQueue = domUpdateQueue;

        this.moveTo(startX, startY);
    }

    /**
     * Moves the player to the specified coordinates on the game board.
     *
     * @param {number} x - The x-coordinate to move to.
     * @param {number} y - The y-coordinate to move to.
     * @param {boolean} [bypassDomQueue=false] - Whether to bypass the DOM update queue and move the player immediately.
     */
    moveTo(x, y, bypassDomQueue = false) {
        const top = CELL_HEIGHT / 2 - PLAYER_HEIGHT / 2 + BOARD_PADDING + (y * CELL_HEIGHT + y * GRID_GAP);
        const left = CELL_WIDTH / 2 - PLAYER_WIDTH / 2 + BOARD_PADDING + (x * CELL_WIDTH + x * GRID_GAP);

        this.previousX = this.x; // TODO: Only used to know the direction of the last move for yellow cells
        this.previousY = this.y;

        this.x = x;
        this.y = y;

        if (bypassDomQueue) {
            this.moveToDom(this.playerEl, top, left);
        } else {
            this.domUpdateQueue.push({ player: this, top, left });
        }
    }

    /**
     * Moves the given DOM element to the specified position.
     *
     * @param {HTMLElement} element - The DOM element to move.
     * @param {number} top - The top position to move the element to, in pixels.
     * @param {number} left - The left position to move the element to, in pixels.
     */
    moveToDom(element, top, left) {
        element.style.top = `${top}px`;
        element.style.left = `${left}px`;
    }

    /**
     * Sets the checkpoint for the player.
     *
     * @param {number} x - The x-coordinate of the checkpoint.
     * @param {number} y - The y-coordinate of the checkpoint.
     */
    setCheckpoint(x, y) {
        this.checkpointX = x;
        this.checkpointY = y;
    }
}

export default Player;
