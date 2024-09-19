import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import FlagGuesser from "./games/FlagGuesser/flag-guesser";
import TicTacToe from "./games/TicTacToe/tic-tac-toe";
import { FaGamepad, FaFlag } from "react-icons/fa";
import "./style.css";

const Home = () => (
  <div className="home-container">
    <h1 className="home-title">MultiGames</h1>
    <div className="game-buttons">
      <Link to="/tictactoe" className="game-button">
        <FaGamepad className="game-icon" />
        <span>Tic Tac Toe</span>
      </Link>
      <Link to="/flagguesser" className="game-button">
        <FaFlag className="game-icon" />
        <span>Devinez le drapeau</span>
      </Link>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/flagguesser" element={<FlagGuesser />} />
      </Routes>
    </Router>
  );
}
