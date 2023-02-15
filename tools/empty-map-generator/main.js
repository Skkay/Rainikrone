import fs from 'fs';

const args = process.argv.slice(2);

const width = parseInt(args[0]);
const height = parseInt(args[1]);

const result = {
    cells: [],
};

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const cell = {
            type: 'empty',
            position: {
                x: x,
                y: y,
            },
        };

        result.cells.push(cell);
    }
}

const jsonResult = JSON.stringify(result, null, 4);

fs.writeFile('./tools/empty-map-generator/output.json', jsonResult, (err) => {
    if (err) {
        console.error(err);
    }
});
