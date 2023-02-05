import './style.css';
import { init, moveCharacterLeft, moveCharacterRight, moveCharacterUp, moveCharacterDown } from './src/game.js';

init();

const moveLeftButtonEl = document.getElementById('moveLeftButton');
const moveRightButtonEl = document.getElementById('moveRightButton');
const moveUpButtonEl = document.getElementById('moveUpButton');
const moveDownButtonEl = document.getElementById('moveDownButton');

moveLeftButtonEl.addEventListener('click', () => moveCharacterLeft());
moveRightButtonEl.addEventListener('click', () => moveCharacterRight());
moveUpButtonEl.addEventListener('click', () => moveCharacterUp());
moveDownButtonEl.addEventListener('click', () => moveCharacterDown());
