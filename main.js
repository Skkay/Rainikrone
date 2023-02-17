import './style.css';
import Game from './src/Game';

const moveLeftButton = document.getElementById('moveLeftButton');
const moveRightButton = document.getElementById('moveRightButton');
const moveUpButton = document.getElementById('moveUpButton');
const moveDownButton = document.getElementById('moveDownButton');

const remainingObjectivesEl = document.getElementById('remainingObjectives');
const moveCountEl = document.getElementById('moveCount');

fetch('boards/default.json')
    .then((res) => res.json())
    .then((board) => startGame(board));

const startGame = (board) => {
    const game = new Game(board, document.getElementById('container'));

    game.bootstrap();
    game.init();

    remainingObjectivesEl.innerText = game.remainingObjectives;
    moveCountEl.innerText = game.moveCount;

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

    document.addEventListener('playerMove', () => {
        remainingObjectivesEl.innerText = game.remainingObjectives;
        moveCountEl.innerText = game.moveCount;
    });
};
