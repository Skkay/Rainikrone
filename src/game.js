const VARIABLE_CELL_TYPES = ['red-cell', 'yellow-cell', 'black-cell', 'green-cell'];

const BOARD_PADDING = 5;
const GRID_GAP = 2;
const CELL_WIDTH = 50;

const CHARACTER_WIDTH = 34;

const character = {
    position: {
        x: 5,
        y: 5,
    },
};

const init = () => {
    const cells = document.querySelectorAll('.cell:not(.wall):not(.start):not(.pink-cell)');

    cells.forEach((element) => {
        const randomCell = VARIABLE_CELL_TYPES[Math.floor(Math.random() * VARIABLE_CELL_TYPES.length)];

        element.classList.add(randomCell);
    });

    moveCharacterTo(character.position.x, character.position.y);
};

const moveCharacterTo = (x, y) => {
    const left = CELL_WIDTH / 2 - CHARACTER_WIDTH / 2 + BOARD_PADDING + (x * CELL_WIDTH + x * GRID_GAP);
    const top = CELL_WIDTH / 2 - CHARACTER_WIDTH / 2 + BOARD_PADDING + (y * CELL_WIDTH + y * GRID_GAP);

    const char = document.getElementById('character');
    char.style.top = top + 'px';
    char.style.left = left + 'px';

    character.position.x = x;
    character.position.y = y;
};

const moveCharacterLeft = () => {
    moveCharacterTo(character.position.x - 1, character.position.y);
};

const moveCharacterRight = () => {
    moveCharacterTo(character.position.x + 1, character.position.y);
};

const moveCharacterUp = () => {
    moveCharacterTo(character.position.x, character.position.y - 1);
};

const moveCharacterDown = () => {
    moveCharacterTo(character.position.x, character.position.y + 1);
};

export { init, moveCharacterLeft, moveCharacterRight, moveCharacterUp, moveCharacterDown };
