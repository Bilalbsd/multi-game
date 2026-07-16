import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { FaRedoAlt } from "react-icons/fa";
import GameLayout from "../../components/GameLayout/GameLayout";
import "./tic-tac-toe.style.css";

const App: React.FC = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [scores, setScores] = useState<{ X: number; O: number }>({
    X: 0,
    O: 0,
  });
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkWinner = (squares: string[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setScores((prevScores) => ({
        ...prevScores,
        [newWinner]: prevScores[newWinner as keyof typeof prevScores] + 1,
      }));
    } else if (newBoard.every((cell) => cell !== "")) {
      setIsDraw(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <GameLayout
      accent="violet"
      eyebrow="Duel local"
      title="Tic Tac Toe"
      description="Placez vos symboles à tour de rôle et soyez le premier à en aligner trois."
    >
      {winner && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <div className="tic-tac-toe">
        <section className="score-board" aria-label="Score de la partie">
          <div className={`score-item ${currentPlayer === "X" && !winner ? "is-active" : ""}`}>
            <span className="player player--x">X</span>
            <span className="score-label">Joueur X</span>
            <strong className="score">{scores.X}</strong>
          </div>
          <span className="score-divider">VS</span>
          <div className={`score-item ${currentPlayer === "O" && !winner ? "is-active" : ""}`}>
            <span className="player player--o">O</span>
            <span className="score-label">Joueur O</span>
            <strong className="score">{scores.O}</strong>
          </div>
        </section>

        <section className="tic-panel game-panel">
          <div className="board" aria-label="Plateau de Tic Tac Toe">
            {[0, 1, 2].map((row) => (
              <div key={row} className="board-row">
                {[0, 1, 2].map((col) => {
                  const index = row * 3 + col;
                  const value = board[index];
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleClick(index)}
                      className={`cell ${value ? `cell--${value.toLowerCase()}` : ""}`}
                      disabled={Boolean(value || winner || isDraw)}
                      aria-label={`Ligne ${row + 1}, colonne ${col + 1}${
                        value ? `, occupée par ${value}` : ", vide"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="game-status" role="status" aria-live="polite">
            <p className="game-status__label">État de la partie</p>
            <p className="game-status__message">
              {winner
                ? `Le joueur ${winner} remporte la manche !`
                : isDraw
                  ? "Match nul — belle défense !"
                  : `Au tour du joueur ${currentPlayer}`}
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

export default App;
