const VARIABLE_CELL_TYPES = ['red', 'yellow', 'black', 'green'];

class Cell {
    type;
    x;
    y;
    cellEl;

    constructor(type, x, y) {
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');

        switch (type) {
            case 'objective':
                cellEl.classList.add('objective');
                break;
            case 'obstacle':
                cellEl.classList.add('obstacle');
                break;
            case 'red':
                cellEl.classList.add('red');
                break;
            case 'green':
                cellEl.classList.add('green');
                break;
            case 'yellow':
                cellEl.classList.add('yellow');
                break;
            case 'black':
                cellEl.classList.add('black');
                break;
            case 'random':
                cellEl.classList.add(VARIABLE_CELL_TYPES[Math.floor(Math.random() * VARIABLE_CELL_TYPES.length)]);
                break;
            case 'empty':
                break;
            default:
                throw Error(`Unknown cell type: ${type}`);
        }

        this.type = type;
        this.x = x;
        this.y = y;
        this.cellEl = cellEl;
    }
}

export default Cell;
