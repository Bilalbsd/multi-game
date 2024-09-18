import React, { useState, useEffect } from "react";
import "./style.css";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

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
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const navigate = useNavigate();

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
    startNewQuestion();
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (gameOver) {
    return (
      <div className="game-container">
        <div className="game-over">
          {showConfetti && <Confetti />}
          <h1>Fin du jeu!</h1>
          <p>Votre score: {score} / 10</p>
          <button onClick={resetGame}>Recommencer</button>
          <button onClick={handleReturnHome} className="home-button">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="quiz-container">
        {showConfetti && <Confetti />}
        <div className="header">
          <span>Question: {currentQuestion} / 10</span>
          <span>Vies: {"❤️".repeat(lives)}</span>
          <span>Score: {score}</span>
        </div>
        <div className="flag-container">
          {currentFlag && (
            <img src={currentFlag.flag} alt="Drapeau à deviner" />
          )}
        </div>
        <div className="options-container">
          {options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlagGuesser;
