import type { ReactNode } from "react";
import { FaArrowLeft, FaGamepad } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./game-layout.style.css";

export type GameAccent = "violet" | "cyan" | "amber";

interface GameLayoutProps {
  accent: GameAccent;
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}

export default function GameLayout({
  accent,
  children,
  description,
  eyebrow,
  title,
}: GameLayoutProps) {
  return (
    <main className={`game-page game-page--${accent}`}>
      <nav className="game-topbar" aria-label="Navigation du jeu">
        <Link to="/" className="game-topbar__brand" aria-label="MultiGames, accueil">
          <span className="game-topbar__brand-mark" aria-hidden="true">
            <FaGamepad />
          </span>
          <span>MultiGames</span>
        </Link>
        <Link to="/" className="game-topbar__back">
          <FaArrowLeft aria-hidden="true" />
          <span>Tous les jeux</span>
        </Link>
      </nav>

      <div className="game-page__content">
        <header className="game-heading">
          <p className="game-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
