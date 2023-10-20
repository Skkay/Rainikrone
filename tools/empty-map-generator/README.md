# Empty Map Generator

Generate a JSON map file of a given size with all cells set to "empty".

## Usage

From the root of the project, run the following command (the output file will be saved to `./tools/empty-map-generator/output.json`):

```bash
node tools/empty-map-generator/main.js <width> <height>
```

Where:

```
<width>  - The width of the map to generate
<height> - The height of the map to generate
```

## Example

```bash
node tools/empty-map-generator/main.js 5 5
```

The ouput file should be the same as `./tools/empty-map-generator/example-output.json`.
