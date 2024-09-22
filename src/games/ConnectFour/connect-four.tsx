import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./connect-four.style.css";

const ROWS = 6;
const COLS = 7;

const ConnectFour: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<number | null>(null);

  const dropPiece = (col: number) => {
    if (winner) return;

    const newBoard = [...board];
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === 0) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        checkWinner(row, col);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        break;
      }
    }
  };

  const checkWinner = (row: number, col: number) => {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      for (let i = 1; i < 4; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS) break;
        if (board[newRow][newCol] !== currentPlayer) break;
        count++;
      }
      for (let i = 1; i < 4; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS) break;
        if (board[newRow][newCol] !== currentPlayer) break;
        count++;
      }
      if (count >= 4) {
        setWinner(currentPlayer);
        return;
      }
    }
  };

  const resetGame = () => {
    setBoard(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(0))
    );
    setCurrentPlayer(1);
    setWinner(null);
  };

  return (
    <div className="connect-four">
      <h1>Puissance 4</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${
                  cell === 1 ? "player1" : cell === 2 ? "player2" : ""
                }`}
                onClick={() => dropPiece(colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      {winner && (
        <div className="winner">
          Le joueur {winner} a gagné !
          <button onClick={resetGame}>Rejouer</button>
          <Link to="/" className="home-button">
            Retour à l'accueil
          </Link>
        </div>
      )}
      {!winner && (
        <div className="current-player">Au tour du joueur {currentPlayer}</div>
      )}
    </div>
  );
};

export default ConnectFour;
