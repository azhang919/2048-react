import { useState } from 'react';
import useKeypress from 'react-use-keypress';
import './App.css';
import Game from './engine/game.js';
import Board from './Board.js';
import Message from './Message.js';

function App() {

  let [game, setGame] = useState(new Game(4));

  // Handle arrow key presses
  const keyCodes = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

  useKeypress(keyCodes, (e) => {
    let temp_game = new Game(4);
    temp_game.loadGame(game.getGameState());

    let dir = e.key.slice(5, e.key.length).toLowerCase();
    e.preventDefault();
    temp_game.move(dir);

    setGame(temp_game);
  });

  // Handle reset button presses
  function handleButtonPress() {
    setGame(new Game(4));
  }  

  // Render game
  return (
    <div className="app">
      <div className="med-container">
        <div className="button-container">
          <button className="button is-dark mt-1" onClick={handleButtonPress}>New Game</button> 
        </div>        
        <div className="score mt-2 mb-2">Score: {game.state.score}</div>
        <table>
            {<Board gameObj={game}/>}
        </table>
      </div>
      <div className="med-container mt-3">
        <Message win={game.state.won} lose={game.state.over}/>
      </div>
    </div>
  );
}

export default App;