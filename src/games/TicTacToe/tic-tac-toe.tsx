import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import "./style.css";

const App: React.FC = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [scores, setScores] = useState<{ X: number; O: number }>({ X: 0, O: 0 });
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navigate = useNavigate();

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
      setScores(prevScores => ({
        ...prevScores,
        [newWinner]: prevScores[newWinner as keyof typeof prevScores] + 1
      }));
    } else if (newBoard.every(cell => cell !== "")) {
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

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="game-container">
      {winner && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <h1>Tic Tac Toe</h1>
      <div className="score-board">
        <div className="score-item">
          <span className="player">X</span>
          <span className="score">{scores.X}</span>
        </div>
        <div className="score-item">
          <span className="player">O</span>
          <span className="score">{scores.O}</span>
        </div>
      </div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ display: "flex" }}>
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              return (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className="cell"
                >
                  {board[index]}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="game-info">
        {winner ? (
          <>
            <p>Le gagnant est : {winner}</p>
            <button onClick={resetGame} className="reset-button">
              Recommencer
            </button>
            <button onClick={handleReturnHome} className="home-button">
              Retour à l'accueil
            </button>
          </>
        ) : isDraw ? (
          <>
            <p>Match nul !</p>
            <button onClick={resetGame} className="reset-button">
              Recommencer
            </button>
            <button onClick={handleReturnHome} className="home-button">
              Retour à l'accueil
            </button>
          </>
        ) : (
          <>
            <p>Joueur actuel : {currentPlayer}</p>
            <button onClick={resetGame} className="reset-button">
              Recommencer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
