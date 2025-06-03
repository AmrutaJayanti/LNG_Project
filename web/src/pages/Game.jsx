import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import './../styles/Game.css'
import Square from "./../components/Square";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const Game = () => {
  const navigate = useNavigate(); // ✅ Hook for navigation
  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [finishedState, setFinishetState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);
  const [playingAs, setPlayingAs] = useState(null);

  const checkWinner = () => {
    for (let row = 0; row < gameState.length; row++) {
      if (
        gameState[row][0] === gameState[row][1] &&
        gameState[row][1] === gameState[row][2]
      ) {
        setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
        return gameState[row][0];
      }
    }

    for (let col = 0; col < gameState.length; col++) {
      if (
        gameState[0][col] === gameState[1][col] &&
        gameState[1][col] === gameState[2][col]
      ) {
        setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return gameState[0][col];
      }
    }

    if (
      gameState[0][0] === gameState[1][1] &&
      gameState[1][1] === gameState[2][2]
    ) {
      return gameState[0][0];
    }

    if (
      gameState[0][2] === gameState[1][1] &&
      gameState[1][1] === gameState[2][0]
    ) {
      return gameState[0][2];
    }

    const isDrawMatch = gameState.flat().every((e) => e === "circle" || e === "cross");
    if (isDrawMatch) return "draw";

    return null;
  };

  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setFinishetState(winner);
    }
  }, [gameState]);

  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "You need to write something!";
      },
    });
    return result;
  };

  socket?.on("opponentLeftMatch", () => setFinishetState("opponentLeftMatch"));
  socket?.on("playerMoveFromServer", (data) => {
    const id = data.state.id;
    setGameState((prevState) => {
      let newState = [...prevState];
      const rowIndex = Math.floor(id / 3);
      const colIndex = id % 3;
      newState[rowIndex][colIndex] = data.state.sign;
      return newState;
    });
    setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");
  });
  socket?.on("connect", () => setPlayOnline(true));
  socket?.on("OpponentNotFound", () => setOpponentName(false));
  socket?.on("OpponentFound", (data) => {
    setPlayingAs(data.playingAs);
    setOpponentName(data.opponentName);
  });

  const playOnlineClick = async () => {
    const result = await takePlayerName();
    if (!result.isConfirmed) return;

    const username = result.value;
    setPlayerName(username);
    const newSocket = io("https://lng-project-1.onrender.com", { autoConnect: true });

    newSocket?.emit("request_to_play", { playerName: username });
    setSocket(newSocket);
  };

  const resetGame = () => {
    setGameState(renderFrom);
    setCurrentPlayer("circle");
    setFinishetState(false);
    setFinishedArrayState([]);
    setPlayOnline(false);
    setOpponentName(null);
    setPlayingAs(null);
    if (socket) socket.disconnect();
    setSocket(null);
  };

  if (!playOnline) {
    return (
      <div className="main-div">
        <button onClick={playOnlineClick} className="playOnline">Play Online</button>
      </div>
    );
  }

  if (playOnline && !opponentName) {
    return (
      <div className="waiting">
        <p>Waiting for opponent</p>
      </div>
    );
  }

  return (
    <div className="main-div">
      <div className="move-detection">
        <div className={`left ${currentPlayer === playingAs ? "current-move-" + currentPlayer : ""}`}>
          {playerName}
        </div>
        <div className={`right ${currentPlayer !== playingAs ? "current-move-" + currentPlayer : ""}`}>
          {opponentName}
        </div>
      </div>
      <h1 className="game-heading water-background">Tic Tac Toe</h1>
      <div className="square-wrapper">
        {gameState.map((arr, rowIndex) =>
          arr.map((e, colIndex) => (
            <Square
              key={rowIndex * 3 + colIndex}
              socket={socket}
              playingAs={playingAs}
              gameState={gameState}
              finishedArrayState={finishedArrayState}
              finishedState={finishedState}
              currentPlayer={currentPlayer}
              setCurrentPlayer={setCurrentPlayer}
              setGameState={setGameState}
              id={rowIndex * 3 + colIndex}
              currentElement={e}
            />
          ))
        )}
      </div>

      {/* Game Over Messages */}
      {finishedState && finishedState !== "opponentLeftMatch" && finishedState !== "draw" && (
        <h3 className="finished-state">{finishedState === playingAs ? "You " : finishedState} won the game</h3>
      )}
      {finishedState === "draw" && <h3 className="finished-state">It's a Draw</h3>}
      {finishedState === "opponentLeftMatch" && <h2>You won the match, Opponent has left</h2>}

      {/* Game Info */}
      {!finishedState && opponentName && (
        <h2>You are playing against {opponentName}</h2>
      )}

      {/* Buttons after game ends */}
      {finishedState && (
        <div className="button-container">
          <button className="btn" onClick={resetGame}>Play Again</button>
          <button className="btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      )}
    </div>
  );
};

export default Game;
