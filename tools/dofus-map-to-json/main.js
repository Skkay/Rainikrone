import fs from 'fs';
import Jimp from 'jimp';

/**
 * Converts an RGB color object to a hexadecimal color string.
 *
 * @param {Object} color - An object representing an RGB color.
 * @param {number} color.r - The red component of the color (0-255).
 * @param {number} color.g - The green component of the color (0-255).
 * @param {number} color.b - The blue component of the color (0-255).
 *
 * @returns {string} The hexadecimal representation of the color, prefixed with a hash (#).
 */
const rgbToHex = ({ r, g, b }) =>
    '#' +
    [r, g, b]
        .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');

/**
 * Returns the type of a cell based on its hex color code.
 *
 * @param {Object} cellsColors - An object containing arrays of hex color codes for different cell types.
 * @param {string} hex - The hex color code of the cell.
 *
 * @returns {string} - The type of the cell.
 *
 * @throws {Error} - If the cell type cannot be determined.
 */
const getTypeByHex = (cellsColors, hex) => {
    if (cellsColors.red.includes(hex)) {
        return 'red';
    } else if (cellsColors.green.includes(hex)) {
        return 'green';
    } else if (cellsColors.yellow.includes(hex)) {
        return 'yellow';
    } else if (cellsColors.black.includes(hex)) {
        return 'black';
    } else if (cellsColors.objective.includes(hex)) {
        return 'objective';
    } else if (cellsColors.obstacle.includes(hex)) {
        return 'obstacle';
    } else {
        throw Error('Can not determine cell type');
    }
};

// should be read from arg
const leftCellPixelPos = {
    x: 455,
    y: 505,
};

// should be read from arg
const topCellPixelPos = {
    x: 937,
    y: 263,
};

// should be read from arg
const cellsColors = {
    objective: ['#aa6393'],
    obstacle: ['#000000'],
    red: ['#a56442', '#ab6948'],
    green: ['#69944e', '#6f9954'],
    yellow: ['#aca84c', '#a6a346'],
    black: ['#696348', '#635e42'],
};

const inputImg = await Jimp.read('./tools/dofus-map-to-json/input.png');

const nbCell = 11;

const cellPixelSize = {
    width: Math.round((topCellPixelPos.x - leftCellPixelPos.x) / nbCell),
    height: Math.round((leftCellPixelPos.y - topCellPixelPos.y) / nbCell),
};

const result = {
    cells: [],
};

for (let col = 0; col < nbCell; col++) {
    for (let row = 0; row < nbCell; row++) {
        const x = leftCellPixelPos.x + row * cellPixelSize.width + col * cellPixelSize.width + cellPixelSize.width;
        const y = leftCellPixelPos.y - row * cellPixelSize.height + col * cellPixelSize.height;

        const hexColor = rgbToHex(Jimp.intToRGBA(inputImg.getPixelColor(x, y)));

        result.cells.push({
            type: col === 5 && row === 5 ? 'checkpoint' : getTypeByHex(cellsColors, hexColor),
            start: col === 5 && row === 5,
            position: {
                x: row,
                y: col,
            },
        });
    }
}

const jsonResult = JSON.stringify(result, null, 4);

fs.writeFile('./tools/dofus-map-to-json/output.json', jsonResult, (err) => {
    if (err) {
        console.error(err);
    }
});
