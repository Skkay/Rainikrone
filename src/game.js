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

const boardBoundary = {
    x1: 0,
    y1: 0,
    x2: 10,
    y2: 10,
};

const objectives = [
    {
        done: false,
        position: {
            x: 0,
            y: 0,
        },
    },
    {
        done: false,
        position: {
            x: 10,
            y: 0,
        },
    },
    {
        done: false,
        position: {
            x: 0,
            y: 10,
        },
    },
    {
        done: false,
        position: {
            x: 10,
            y: 10,
        },
    },
];

const obstacles = [
    {
        position: {
            x: 5,
            y: 0,
        },
    },
    {
        position: {
            x: 5,
            y: 1,
        },
    },
    {
        position: {
            x: 0,
            y: 5,
        },
    },
    {
        position: {
            x: 1,
            y: 5,
        },
    },
    {
        position: {
            x: 9,
            y: 5,
        },
    },
    {
        position: {
            x: 10,
            y: 5,
        },
    },
    {
        position: {
            x: 5,
            y: 9,
        },
    },
    {
        position: {
            x: 5,
            y: 10,
        },
    },
];

const init = () => {
    const cells = document.querySelectorAll('.cell:not(.wall):not(.start):not(.pink-cell)');

    cells.forEach((element) => {
        const randomCell = VARIABLE_CELL_TYPES[Math.floor(Math.random() * VARIABLE_CELL_TYPES.length)];

        element.classList.add(randomCell);
    });

    moveCharacterTo(character.position.x, character.position.y);
};

const moveCharacterTo = (x, y) => {
    if (positionIsObstacle(x, y) || positionIsOutOfBounds(x, y)) {
        return false;
    }

    const left = CELL_WIDTH / 2 - CHARACTER_WIDTH / 2 + BOARD_PADDING + (x * CELL_WIDTH + x * GRID_GAP);
    const top = CELL_WIDTH / 2 - CHARACTER_WIDTH / 2 + BOARD_PADDING + (y * CELL_WIDTH + y * GRID_GAP);

    const char = document.getElementById('character');
    char.style.top = top + 'px';
    char.style.left = left + 'px';

    character.position.x = x;
    character.position.y = y;

    if (positionIsObjective(x, y) && isAllObjectiveDone()) {
        console.log('All done !');
    }
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

const positionIsObstacle = (x, y) => {
    const isObstacle = obstacles.some((obstacle) => {
        return obstacle.position.x === x && obstacle.position.y === y;
    });

    return isObstacle;
};

const positionIsOutOfBounds = (x, y) => {
    return x < boardBoundary.x1 || y < boardBoundary.y1 || x > boardBoundary.x2 || y > boardBoundary.y2;
};

const positionIsObjective = (x, y) => {
    const isObjective = objectives.some((objective) => {
        if (objective.position.x === x && objective.position.y === y) {
            objective.done = true;

            return true;
        }

        return false;
    });

    return isObjective;
};

const isAllObjectiveDone = () => {
    const allDone = !objectives.some((objective) => objective.done === false);

    return allDone;
};

export { init, moveCharacterLeft, moveCharacterRight, moveCharacterUp, moveCharacterDown };
