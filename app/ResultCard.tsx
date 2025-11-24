import React, { useEffect, useState } from "react";
import { bibleRefToString, Result } from "./BibleGame";
import { Star, CheckCircle, XCircle, AlertTriangle, Drum } from "lucide-react";
import ProgressBarAnswer from "./ProgressBarAnswer";
import { SCORE_GRID } from "../lib/score";

interface ResultCardProps {
  result: Result;
  malus?: number;
}

export type Level = {
  level: number;
  color: string;
  icon: React.ReactNode;
  scale?: number;
};
export function getLevel(percent: number, useException = false): Level {
  if (useException && percent == 100)
    return {
      level: 4,
      color: "lime",
      icon: <Drum className="w-8 h-8 text-lime-600" />,
      scale: 110,
    };

  if (percent >= 80)
    return {
      level: 3,
      color: "emerald",
      icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
      scale: 150,
    };
  if (percent >= 50)
    return {
      level: 2,
      color: "indigo",
      icon: <Star className="w-8 h-8 text-indigo-600" />,
      scale: 150,
    };
  if (percent >= 20)
    return {
      level: 1,
      color: "amber",
      icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
      scale: 150,
    };
  return {
    level: 0,
    color: "red",
    icon: <XCircle className="w-8 h-8 text-red-600" />,
    scale: 150,
  };
}

const ResultCard: React.FC<ResultCardProps> = ({ result, malus }) => {
  const { score, guess, solution } = result;
  const level = getLevel(score.total, true);

  const [animatedScore, setAnimatedScore] = useState(0);

  // Animation du score
  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 2; // vitesse
      if (start > score.total) start = score.total;
      setAnimatedScore(start);
      if (start < score.total) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  const radius = 40;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const finalScore = Math.ceil(score.malus * score.total);

  return (
    <div
      className={`
        p-2 md:p-6 rounded-2xl shadow-lg border-2
        bg-${level.color}-50 border-${level.color}-400
        transition-all duration-300
        flex flex-col items-center justify-center 
        text-center gap-2 w-full max-w-2xl
      `}
    >
      {/* Cercle SVG */}
      <div className="flex flex-row gap-2 md:gap-6">
        <div className="flex items-center justify-center">
          <svg width={150} height={150} className="mb-1">
            <circle
              cx={75}
              cy={75}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={75}
              cy={75}
              r={radius}
              //stroke={level.color}
              //stroke="currentColor"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={`transition-all duration-500 stroke-${level.color}-500`}
            />
          </svg>
        </div>
        <div className="flex items-center justify-center gap-2">
          {/* Score dynamique avec pop */}
          <div
            className={`
          text-2xl font-bold mb-2 text-center
          transform transition-transform duration-500
          ${level.scale ? "scale-" + level.scale : "scale-100"}
          text-${level.color}-600
        `}
          >
            <span className="mr-2 text-8xl">
              {score.total == 100 ? `✅ ${finalScore}` : finalScore}
            </span>
          </div>

          {/* Icône */}
        </div>
      </div>

      <div className="max-w-md text-center text-gray-700 leading-relaxed">
        <div className="m-4 bg-white rounded-2xl shadow p-6 text-xl leading-relaxed">
          {solution.text}
        </div>
      </div>

      {score.total < 100 && (
        <div className="text-gray-600 mt-1 text-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:me-4">Réponse correcte</div>
            <div className="font-bold">{bibleRefToString(solution)}</div>
          </div>
        </div>
      )}

      {/* Glow léger si score élevé */}
      {score.total >= 80 && (
        <div className="absolute inset-0 rounded-3xl shadow-[0_0_25px_rgba(34,197,94,0.5)] pointer-events-none animate-pulse"></div>
      )}
      {/* Texte réponse */}
      <div className="text-lg font-normal">
        <div className="flex flex-col md:flex-row">
          <div className="md:me-4">Vous avez répondu</div>
          <div className="font-semibold md:me-4">{bibleRefToString(guess)}</div>
          {score.malus != 1 && (
            <div className="font-normal">
              (💡 avec le contexte = {malus != 1 && <span>× {malus}</span>})
            </div>
          )}
        </div>
      </div>

      {/* Barres de score*/}

      <div className="w-full max-w-xl mx-auto space-y-4">
        <ProgressBarAnswer
          label="testament"
          points={score.testament}
          percent={(100 * score.testament) / SCORE_GRID.testament}
        />
        <ProgressBarAnswer
          label="livre"
          points={score.book}
          percent={(100 * score.book) / SCORE_GRID.book}
        />
        <ProgressBarAnswer
          label="chapitre"
          points={score.chapter}
          percent={(100 * score.chapter) / SCORE_GRID.chapter}
        />
        <ProgressBarAnswer
          label="verset"
          points={score.verse}
          percent={(100 * score.verse) / SCORE_GRID.verse}
        />
      </div>
    </div>
  );
};

export default ResultCard;
