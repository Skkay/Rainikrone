const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;
const PLAYER_WIDTH = 34;
const PLAYER_HEIGHT = 34;
const BOARD_PADDING = 5;
const GRID_GAP = 2;

class Player {
    x;
    y;
    playerEl;

    constructor(startX, startY) {
        const playerEl = document.createElement('div');
        playerEl.setAttribute('id', 'player');

        this.playerEl = playerEl;
        this.moveTo(startX, startY);
    }

    moveTo(x, y) {
        const top = CELL_HEIGHT / 2 - PLAYER_HEIGHT / 2 + BOARD_PADDING + (y * CELL_HEIGHT + y * GRID_GAP);
        const left = CELL_WIDTH / 2 - PLAYER_WIDTH / 2 + BOARD_PADDING + (x * CELL_WIDTH + x * GRID_GAP);

        this.playerEl.style.top = `${top}px`;
        this.playerEl.style.left = `${left}px`;

        this.x = x;
        this.y = y;
    }
}

export default Player;
