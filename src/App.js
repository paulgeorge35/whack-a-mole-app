import io from 'socket.io-client';
import './App.css';
import useGame from './useGame';

const DEBUG = process.env.REACT_APP_NODE_ENV === 'development';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const socket = io(REACT_APP_API_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

function App() {
  const { data, handleJoinGame, handleResetGame, handleRestartGame, handleClick, handleStartGame, handleDebugGame } = useGame(socket);

  return (
    <div className="App">
      {DEBUG && <Debug onClick={handleDebugGame} />}
      {data.gameStarted && data.clientId ?
        <GameButton data={data} onClick={handleClick} restartGame={handleRestartGame} />
        :
        <Menu data={data} onClick={handleJoinGame} startGame={handleStartGame} resetGame={handleResetGame} />
      }
    </div>
  );
}

export default App;

function GameButton({ onClick, data, restartGame }) {
  return (
    <div onClick={onClick} className={data.gameEnded ? 'gameOver' : data.isMole ? 'mole' : 'not-mole'} role='button'>
      {!data.mainClient && data.gameEnded && <p className='gameOverText'>GAME OVER</p>}
      {data.mainClient && data.timeLeft > 0 && <p className='timer'>{data.timeLeft}</p>}
      {data.mainClient && data.gameEnded && <p className='score'>{data.score}</p>}
      {data.mainClient && data.gameEnded && <button onClick={restartGame} className='joinButton'>RESTART GAME</button>}
    </div>
  )
}

function Menu({ onClick, resetGame, startGame, data }) {
  const waitingPlayers = Math.max(3 - data.players, 0);
  const waitingText = waitingPlayers === 1 ? 'PLAYER' : 'PLAYERS'
  return (
    <span className='menu'>
      <h1><img src='/logo192.png' alt='Logo' />Whack-A-Mole</h1>
      {DEBUG && <p className='debugId'>[{data.clientId}]</p>}
      {data.clientId ?
        <span className='menuButtons'>
          {data.mainClient && data.players >= 3 && <button onClick={startGame} className='joinButton'>START GAME</button>}
          {(!data.mainClient || data.waitingPlayers > 0) && <button disabled className='waitingButton'>{waitingPlayers === 0 ? 'GAME WILL START SOON...' : `WAITING FOR ${waitingPlayers} MORE ${waitingText}...`}</button>}
          {data.mainClient && <button onClick={resetGame} className='resetButton'>RESET GAME</button>}
        </span>
        :
        <span>
          {data.gameStarted && !data.gameEnded ?
            <button disabled onClick={onClick} className='waitingButton'>{`GAME IN PROGRESS [${data.timeLeft}]`}</button>
            :
            <button onClick={onClick} className='joinButton'>JOIN</button>
          }
        </span>
      }
    </span>
  )
}

function Debug({ onClick }) {
  return (
    <button onClick={onClick} className='debugButton'>?</button>
  )
}