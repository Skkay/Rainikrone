const VARIABLE_CELL_TYPES = ['red-cell', 'yellow-cell', 'black-cell', 'green-cell'];

const init = () => {
    const cells = document.querySelectorAll('.cell:not(.wall):not(.start):not(.pink-cell)');

    cells.forEach((element) => {
        const randomCell = VARIABLE_CELL_TYPES[Math.floor(Math.random() * VARIABLE_CELL_TYPES.length)];

        element.classList.add(randomCell);
    });
};

export { init };
