import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Minimal, modern, light-themed Tic Tac Toe game in React.
 * Features: Player-vs-Player, new/restart, status, winner/draw, modern UI.
 */

// Game constants
const PLAYER_X = "X";
const PLAYER_O = "O";
const BOARD_SIZE = 3;

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // board: flat array of 9 cells
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);
  const [winner, setWinner] = useState(""); // 'X', 'O', 'Draw' or ""
  const [moveCount, setMoveCount] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  // Automatically set theme on load
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Check for winner/play
  useEffect(() => {
    if (moveCount === 0) return;
    const check = calculateWinner(board);
    if (check) {
      setGameActive(false);
      setWinner(check);
    } else if (moveCount === 9) {
      setGameActive(false);
      setWinner("Draw");
    }
  }, [board, moveCount]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  function startNewGame() {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(""));
    setCurrentPlayer(PLAYER_X);
    setWinner("");
    setMoveCount(0);
    setGameActive(true);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    startNewGame();
  }

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    if (!gameActive || board[idx]) return;
    const updated = [...board];
    updated[idx] = currentPlayer;
    setBoard(updated);
    setMoveCount(moveCount + 1);
    setCurrentPlayer((p) => (p === PLAYER_X ? PLAYER_O : PLAYER_X));
  }

  // UI helpers
  function renderStatus() {
    if (winner === "Draw") return <span className="status status-draw">Draw!</span>;
    if (winner) return <span className="status status-win">{winner} wins!</span>;
    return (
      <span className="status status-play">
        {currentPlayer}'s turn
      </span>
    );
  }

  return (
    <div className="App">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>
      <main>
        <div className="ttt-container">
          <div className="ttt-status">{renderStatus()}</div>
          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {board.map((cell, idx) => (
              <button
                key={idx}
                className={`ttt-cell${cell ? " marked" : ""}`}
                disabled={!!cell || !!winner}
                onClick={() => handleCellClick(idx)}
                aria-label={`Cell ${Math.floor(idx / 3) + 1}, ${idx % 3 + 1}, ${
                  cell ? cell : "empty"
                }`}
                tabIndex={0}
              >
                {cell}
              </button>
            ))}
          </div>
          <div className="ttt-actions">
            <button
              className="ttt-btn ttt-btn-accent"
              onClick={startNewGame}
              disabled={moveCount === 0 && !winner}
            >
              New Game
            </button>
            <button
              className="ttt-btn"
              onClick={restartGame}
              disabled={moveCount === 0 && !winner}
            >
              Restart
            </button>
          </div>
          <div className="ttt-mode">
            <span>Mode: <strong>Player vs Player</strong></span>
          </div>
        </div>
      </main>
      <footer className="ttt-footer">
        <span>
          &copy; {new Date().getFullYear()} Minimal Tic Tac Toe
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let arr of lines) {
    const [a, b, c] = arr;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
