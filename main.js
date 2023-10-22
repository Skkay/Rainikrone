import './style.css';
import Game from './src/Game';

const optionMapSelectEl = document.getElementById('optionMapSelect');

const remainingObjectivesEl = document.getElementById('remainingObjectives');
const moveCountEl = document.getElementById('moveCount');

const moveLeftButton = document.getElementById('moveLeftButton');
const moveRightButton = document.getElementById('moveRightButton');
const moveUpButton = document.getElementById('moveUpButton');
const moveDownButton = document.getElementById('moveDownButton');

let game;

const handleMoveLeftButtonEvent = () => game.movePlayerLeft();

const handleMoveRightButtonEvent = () => game.movePlayerRight();

const handleMoveUpButtonEvent = () => game.movePlayerUp();

const handleMoveDownButtonEvent = () => game.movePlayerDown();

const handleMoveKeyupEvent = (event) => {
    if (event.key === 'ArrowLeft') {
        game.movePlayerLeft();
    } else if (event.key === 'ArrowRight') {
        game.movePlayerRight();
    } else if (event.key === 'ArrowUp') {
        game.movePlayerUp();
    } else if (event.key === 'ArrowDown') {
        game.movePlayerDown();
    }
};

const handlePlayerMoveEvent = () => {
    remainingObjectivesEl.innerText = game.remainingObjectives;
    moveCountEl.innerText = game.moveCount;
};

const startGame = (board) => {
    game = new Game(board, document.getElementById('container'));

    setInterval(() => game.updateDom(), 100);

    remainingObjectivesEl.innerText = game.remainingObjectives;
    moveCountEl.innerText = game.moveCount;

    moveLeftButton.addEventListener('click', handleMoveLeftButtonEvent);
    moveRightButton.addEventListener('click', handleMoveRightButtonEvent);
    moveUpButton.addEventListener('click', handleMoveUpButtonEvent);
    moveDownButton.addEventListener('click', handleMoveDownButtonEvent);

    document.addEventListener('keyup', handleMoveKeyupEvent);

    document.addEventListener('playerMove', handlePlayerMoveEvent);
};

// Prevent user from changing map when playing the game with the keyboard
optionMapSelectEl.addEventListener('keydown', (event) => {
    event.preventDefault();
});

optionMapSelectEl.addEventListener('change', (event) => {
    const selectedMap = event.target.value;

    fetch(`boards/${selectedMap}.json`)
        .then((res) => res.json())
        .then((board) => startGame(board));
});

// Initial load
const defaultMap = optionMapSelectEl.value;

fetch(`boards/${defaultMap}.json`)
    .then((res) => res.json())
    .then((board) => startGame(board));
