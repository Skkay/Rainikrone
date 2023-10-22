const VARIABLE_CELL_TYPES = ['red', 'yellow', 'black', 'green'];
const VALID_CELL_TYPES = ['objective', 'obstacle', 'random', 'start', 'empty', 'checkpoint', ...VARIABLE_CELL_TYPES];
const CELL_TYPE_ROTATION = {
    yellow: 'red',
    red: 'green',
    green: 'yellow',
    black: 'red',
};

class Cell {
    type;
    x;
    y;
    cellEl;

    domUpdateQueue = [];

    /**
     * @param {string} type - The type of the cell.
     * @param {number} x - The x-coordinate of the cell.
     * @param {number} y - The y-coordinate of the cell.
     * @param {Array} domUpdateQueue - The queue of cells to update in the DOM.
     */
    constructor(type, x, y, domUpdateQueue) {
        const cellEl = document.createElement('div');
        cellEl.setAttribute('id', `cell-${x}-${y}`);
        cellEl.classList.add('cell');

        this.cellEl = cellEl;
        this.x = x;
        this.y = y;
        this.domUpdateQueue = domUpdateQueue;

        this.updateType(type, true);
    }

    /**
     * Updates the type of the cell.
     *
     * @param {string} type - The new type of the cell.
     * @param {boolean} [bypassDomQueue=false] - Whether to bypass the DOM update queue and update the cell immediately.
     *
     * @throws {Error} If the type is not a valid cell type.
     */
    updateType(type, bypassDomQueue = false) {
        if (!VALID_CELL_TYPES.includes(type)) {
            throw Error(`Unknown cell type: ${type}`);
        }

        if (type === 'random') {
            type = VARIABLE_CELL_TYPES[Math.floor(Math.random() * VARIABLE_CELL_TYPES.length)];
        }

        this.type = type;

        if (bypassDomQueue) {
            this.updateTypeDom(this.cellEl, type);
        } else {
            this.domUpdateQueue.push({ cell: this, type });
        }
    }

    /**
     * Updates the type of a DOM element representing a cell.
     *
     * @param {HTMLElement} element - The DOM element to update.
     * @param {string} type - The new type of the cell.
     */
    updateTypeDom(element, type) {
        element.classList.remove(...VALID_CELL_TYPES);
        void element.offsetWidth; // Used to replay the animation
        element.classList.add(type);
    }

    /**
     * Rotates the type of the cell (Yellow -> Red -> Green -> Yellow ; Black -> Red).
     */
    rotateType() {
        this.updateType(CELL_TYPE_ROTATION[this.type]);
    }
}

export default Cell;
