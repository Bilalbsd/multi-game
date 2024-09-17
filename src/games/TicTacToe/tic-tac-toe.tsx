import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./style.css";

const App: React.FC = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
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
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setWinner(null);
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
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ display: "flex" }}>
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              return (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  style={{
                    width: "100px",
                    height: "100px",
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "2px",
                  }}
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
          <p>Le gagnant est : {winner}</p>
        ) : (
          <p>Joueur actuel : {currentPlayer}</p>
        )}
        <button onClick={resetGame} className="reset-button">
          Recommencer
        </button>
      </div>
    </div>
  );
};

export default App;
