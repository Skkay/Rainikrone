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

    updateType(type, bypassDomQueue = false) {
        if (!VALID_CELL_TYPES.includes(type)) {
            throw Error(`Unknown cell type: ${type}`);
        }

        if (type === 'random') {
            type = VARIABLE_CELL_TYPES[Math.floor(Math.random() * VARIABLE_CELL_TYPES.length)];
        }

        this.type = type;

        if (bypassDomQueue) {
            this.cellEl.classList.remove(...VALID_CELL_TYPES);
            this.cellEl.classList.add(type);
        } else {
            this.domUpdateQueue.push({ cell: this, type });
        }
    }

    rotateType() {
        this.updateType(CELL_TYPE_ROTATION[this.type]);
    }
}

export default Cell;
export { VALID_CELL_TYPES };
