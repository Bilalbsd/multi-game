import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import FlagGuesser from "./games/FlagGuesser/flag-guesser";
import TicTacToe from "./games/TicTacToe/tic-tac-toe";
import { FaGamepad, FaFlag } from "react-icons/fa";
import "./style.css";
import ConnectFour from "./games/ConnectFour/connect-four";

const Home = () => (
  <div className="home-container">
    <h1 className="home-title">MultiGames</h1>
    <div className="game-buttons">
      <Link to="/tictactoe" className="game-button">
        <FaGamepad className="game-icon" />
        <span>Tic Tac Toe</span>
      </Link>
      <Link to="/flag-guesser" className="game-button">
        <FaFlag className="game-icon" />
        <span>Devinez le drapeau</span>
      </Link>
      <Link to="/connect-four" className="game-button">
        <FaFlag className="game-icon" />
        <span>Puissance 4</span>
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
        <Route path="/flag-guesser" element={<FlagGuesser />} />
        <Route path="/connect-four" element={<ConnectFour />} />
      </Routes>
    </Router>
  );
}
