import './style.css';
import Game from './src/Game';

const moveLeftButton = document.getElementById('moveLeftButton');
const moveRightButton = document.getElementById('moveRightButton');
const moveUpButton = document.getElementById('moveUpButton');
const moveDownButton = document.getElementById('moveDownButton');

fetch('boards/default.json')
    .then((res) => res.json())
    .then((board) => {
        const game = new Game(board, document.getElementById('container'));

        game.bootstrap();
        game.init();

        moveLeftButton.addEventListener('click', () => game.movePlayerLeft());
        moveRightButton.addEventListener('click', () => game.movePlayerRight());
        moveUpButton.addEventListener('click', () => game.movePlayerUp());
        moveDownButton.addEventListener('click', () => game.movePlayerDown());

        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft') {
                game.movePlayerLeft();
            } else if (event.key === 'ArrowRight') {
                game.movePlayerRight();
            } else if (event.key === 'ArrowUp') {
                game.movePlayerUp();
            } else if (event.key === 'ArrowDown') {
                game.movePlayerDown();
            }
        });
    });
