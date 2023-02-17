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

    moveLeftButton.addEventListener('click', () => {
        game.movePlayerLeft();
        updateGameInfo(game);
    });
    moveRightButton.addEventListener('click', () => {
        game.movePlayerRight();
        updateGameInfo(game);
    });
    moveUpButton.addEventListener('click', () => {
        game.movePlayerUp();
        updateGameInfo(game);
    });
    moveDownButton.addEventListener('click', () => {
        game.movePlayerDown();
        updateGameInfo(game);
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft') {
            game.movePlayerLeft();
            updateGameInfo(game);
        } else if (event.key === 'ArrowRight') {
            game.movePlayerRight();
            updateGameInfo(game);
        } else if (event.key === 'ArrowUp') {
            game.movePlayerUp();
            updateGameInfo(game);
        } else if (event.key === 'ArrowDown') {
            game.movePlayerDown();
            updateGameInfo(game);
        }
    });
};

const updateGameInfo = (game) => {
    remainingObjectivesEl.innerText = game.remainingObjectives;
    moveCountEl.innerText = game.moveCount;
};
