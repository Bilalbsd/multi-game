import React, { useState } from "react";
import { FaArrowDown, FaRedoAlt } from "react-icons/fa";
import GameLayout from "../../components/GameLayout/GameLayout";
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
    <GameLayout
      accent="amber"
      eyebrow="Duel local"
      title="Puissance 4"
      description="Faites tomber vos jetons et construisez une ligne de quatre avant votre adversaire."
    >
      <div className="connect-four">
        <div className="player-legend" aria-label="Couleurs des joueurs">
          <div className={`legend-item ${currentPlayer === 1 && !winner ? "is-active" : ""}`}>
            <span className="legend-disc legend-disc--one" aria-hidden="true" />
            <span>Joueur 1</span>
          </div>
          <span className="legend-divider">VS</span>
          <div className={`legend-item ${currentPlayer === 2 && !winner ? "is-active" : ""}`}>
            <span className="legend-disc legend-disc--two" aria-hidden="true" />
            <span>Joueur 2</span>
          </div>
        </div>

        <section className="connect-panel game-panel">
          <div className="column-controls" aria-label="Choisir une colonne">
            {Array.from({ length: COLS }, (_, colIndex) => (
              <button
                key={colIndex}
                type="button"
                className="drop-button"
                onClick={() => dropPiece(colIndex)}
                disabled={Boolean(winner || board[0][colIndex] !== 0)}
                aria-label={`Jouer dans la colonne ${colIndex + 1}`}
              >
                <FaArrowDown aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="board" aria-label="Plateau de Puissance 4">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                  <span
                    key={colIndex}
                    role="img"
                    className={`cell ${
                      cell === 1 ? "player1" : cell === 2 ? "player2" : ""
                    }`}
                    aria-label={`Ligne ${rowIndex + 1}, colonne ${colIndex + 1} : ${
                      cell === 1 ? "jeton du joueur 1" : cell === 2 ? "jeton du joueur 2" : "vide"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="game-status" role="status" aria-live="polite">
            <p className="game-status__label">État de la partie</p>
            <p className="game-status__message">
              {winner ? `Le joueur ${winner} remporte la manche !` : `Au tour du joueur ${currentPlayer}`}
            </p>
          </div>

          <button type="button" onClick={resetGame} className="app-button app-button--primary">
            <FaRedoAlt aria-hidden="true" />
            Nouvelle manche
          </button>
        </section>
      </div>
    </GameLayout>
  );
};

export default ConnectFour;
