import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import FlagGuesser from "./games/FlagGuesser/flag-guesser";
import TicTacToe from "./games/TicTacToe/tic-tac-toe";
import { FaArrowRight, FaCircle, FaFlag, FaGamepad, FaTimes } from "react-icons/fa";
import type { ReactNode } from "react";
import type { GameAccent } from "./components/GameLayout/GameLayout";
import "./style.css";
import ConnectFour from "./games/ConnectFour/connect-four";

const games = [
  {
    path: "/tictactoe",
    title: "Tic Tac Toe",
    description: "Alignez trois symboles avant votre adversaire dans le grand classique du duel.",
    meta: "2 joueurs · Stratégie",
    accent: "violet",
    icon: <FaTimes aria-hidden="true" />,
  },
  {
    path: "/flag-guesser",
    title: "Quiz des drapeaux",
    description: "Testez votre culture du monde avec dix drapeaux choisis au hasard.",
    meta: "Solo · Culture",
    accent: "cyan",
    icon: <FaFlag aria-hidden="true" />,
  },
  {
    path: "/connect-four",
    title: "Puissance 4",
    description: "Prenez de la hauteur et connectez quatre jetons avant votre rival.",
    meta: "2 joueurs · Tactique",
    accent: "amber",
    icon: <FaCircle aria-hidden="true" />,
  },
] satisfies ReadonlyArray<{
  accent: GameAccent;
  description: string;
  icon: ReactNode;
  meta: string;
  path: string;
  title: string;
}>;

const Home = () => (
  <main className="home-container">
    <div className="home-shell">
      <nav className="home-nav" aria-label="Navigation principale">
        <div className="home-brand">
          <span className="home-brand__mark" aria-hidden="true">
            <FaGamepad />
          </span>
          <span>MultiGames</span>
        </div>
        <span className="home-count">{games.length} jeux disponibles</span>
      </nav>

      <header className="home-hero">
        <p className="home-kicker">Une partie rapide ?</p>
        <h1 className="home-title">À vous de jouer.</h1>
        <p className="home-intro">
          Des jeux simples, immédiats et pensés pour partager un bon moment — seul ou à deux.
        </p>
      </header>

      <section className="game-grid" aria-label="Choisir un jeu">
        {games.map((game) => (
          <Link
            key={game.path}
            to={game.path}
            className={`game-card game-card--${game.accent}`}
          >
            <div className="game-card__top">
              <span className="game-card__icon">{game.icon}</span>
              <span className="game-card__meta">{game.meta}</span>
            </div>
            <h2>{game.title}</h2>
            <p>{game.description}</p>
            <span className="game-card__cta">
              Jouer maintenant
              <FaArrowRight aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  </main>
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
