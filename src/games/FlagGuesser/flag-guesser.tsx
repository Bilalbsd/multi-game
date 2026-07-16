import React, { useState, useEffect } from "react";
import "./flag-guesser.style.css";
import Confetti from "react-confetti";
import { FaRedoAlt } from "react-icons/fa";
import GameLayout from "../../components/GameLayout/GameLayout";

interface Flag {
  name: string;
  flag: string;
}

const FlagGuesser: React.FC = () => {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [currentFlag, setCurrentFlag] = useState<Flag | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=translations,flags"
        );
        const data = await response.json();
        const frenchFlags = data.map(
          (country: {
            translations: { fra: { common: string } };
            flags: { svg: string };
          }) => ({
            name: country.translations.fra.common,
            flag: country.flags.svg,
          })
        );
        setFlags(frenchFlags);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des drapeaux:", error);
        setHasLoadError(true);
        setIsLoading(false);
      }
    };
    fetchFlags();
  }, []);

  useEffect(() => {
    if (!isLoading && flags.length > 0 && currentQuestion === 0) {
      startNewQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, flags, currentQuestion]);

  useEffect(() => {
    if (lives === 0 || currentQuestion > 10) {
      setGameOver(true);
    }
  }, [lives, currentQuestion]);

  useEffect(() => {
    if (score === 10) {
      setShowConfetti(true);
      setGameOver(true);
    }
  }, [score]);

  const startNewQuestion = () => {
    if (currentQuestion < 10 && lives > 0 && flags.length > 0) {
      const correctAnswer = flags[Math.floor(Math.random() * flags.length)];
      setCurrentFlag(correctAnswer);
      const wrongAnswers = getWrongAnswers(correctAnswer);
      setOptions(shuffleArray([correctAnswer.name, ...wrongAnswers]));
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  const getWrongAnswers = (correctAnswer: Flag): string[] => {
    const wrongAnswers: string[] = [];
    while (wrongAnswers.length < 3) {
      const randomFlag = flags[Math.floor(Math.random() * flags.length)];
      if (
        randomFlag.name !== correctAnswer.name &&
        !wrongAnswers.includes(randomFlag.name)
      ) {
        wrongAnswers.push(randomFlag.name);
      }
    }
    return wrongAnswers;
  };

  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (currentFlag && selectedAnswer === currentFlag.name) {
      setScore((prev) => prev + 1);
    } else {
      setLives((prev) => prev - 1);
    }
    if (currentQuestion < 10 && lives > 0) {
      startNewQuestion();
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setShowConfetti(false);
  };

  return (
    <GameLayout
      accent="cyan"
      eyebrow="Tour du monde"
      title="Quiz des drapeaux"
      description="Observez le drapeau, choisissez le bon pays et conservez vos trois vies."
    >
      <div className="flag-guesser">
        {showConfetti && <Confetti recycle={false} numberOfPieces={420} />}

        {isLoading ? (
          <section className="quiz-container game-panel loading-state" role="status" aria-live="polite">
            <span className="loading-spinner" aria-hidden="true" />
            <h2>Préparation du voyage…</h2>
            <p>Nous rassemblons les drapeaux du monde.</p>
          </section>
        ) : hasLoadError ? (
          <section
            className="quiz-container game-panel load-error"
            role="alert"
            aria-labelledby="flag-error-title"
          >
            <p className="result-kicker">Connexion interrompue</p>
            <h2 id="flag-error-title">Impossible de charger les drapeaux</h2>
            <p>Vérifiez votre connexion, puis réessayez dans un instant.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="app-button app-button--primary"
            >
              <FaRedoAlt aria-hidden="true" />
              Réessayer
            </button>
          </section>
        ) : gameOver ? (
          <section
            className="quiz-container game-panel game-over"
            aria-labelledby="quiz-result-title"
            role="status"
            aria-live="assertive"
          >
            <p className="result-kicker">Partie terminée</p>
            <h2 id="quiz-result-title">
              {score >= 8 ? "Explorateur confirmé !" : "Beau voyage !"}
            </h2>
            <div className="result-score">
              <strong>{score}</strong>
              <span>/ 10 bonnes réponses</span>
            </div>
            <button type="button" onClick={resetGame} className="app-button app-button--primary">
              <FaRedoAlt aria-hidden="true" />
              Rejouer
            </button>
          </section>
        ) : (
          <section className="quiz-container game-panel" aria-label="Question en cours">
            <div className="quiz-stats" aria-label="Progression du quiz">
              <div className="stat-item">
                <span>Question</span>
                <strong>{currentQuestion}<small>/10</small></strong>
              </div>
              <div className="stat-item stat-item--lives">
                <span>Vies</span>
                <strong aria-label={`${lives} vies restantes`}>{"♥".repeat(lives)}</strong>
              </div>
              <div className="stat-item">
                <span>Score</span>
                <strong>{score}</strong>
              </div>
            </div>

            <div className="flag-container">
              {currentFlag && <img src={currentFlag.flag} alt="Drapeau à deviner" />}
            </div>

            <p className="question-prompt" role="status" aria-live="polite">
              Question {currentQuestion} sur 10 : à quel pays appartient ce drapeau ?
            </p>

            <div className="options-container">
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className="answer-button"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </GameLayout>
  );
};

export default FlagGuesser;
