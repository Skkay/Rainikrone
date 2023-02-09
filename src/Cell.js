const VARIABLE_CELL_TYPES = ['red', 'yellow', 'black', 'green'];
const VALID_CELL_TYPES = ['objective', 'obstacle', 'random', 'start', 'empty', ...VARIABLE_CELL_TYPES];

class Cell {
    type;
    x;
    y;
    cellEl;

    constructor(type, x, y) {
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');

        this.cellEl = cellEl;
        this.x = x;
        this.y = y;
        this.updateType(type);
    }

    updateType(type) {
        if (!VALID_CELL_TYPES.includes(type)) {
            throw Error(`Unknown cell type: ${type}`);
        }

        if (type === 'random') {
            type = VARIABLE_CELL_TYPES[Math.floor(Math.random() * VARIABLE_CELL_TYPES.length)];
        }

        this.type = type;
        this.cellEl.classList.add(type);
    }
}

export default Cell;