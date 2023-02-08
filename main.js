import './style.css';
import Game from './src/Game';

fetch('board.json')
    .then((res) => res.json())
    .then((board) => {
        const game = new Game(board, document.getElementById('container'));

        game.bootstrap();
        game.init();
    });
