import React from "react";
import { getLevel } from "./ResultCard";

interface ProgressBarAnswerProps {
  label: string; // Nom du score / catégorie
  //userAnswer?: string; // Réponse donnée
  //correctAnswer?: string; // Réponse correcte
  percent: number;
  points: number;
}

const ProgressBarAnswer: React.FC<ProgressBarAnswerProps> = ({
  label,
  //userAnswer,
  //correctAnswer,
  percent,
  points,
}) => {
  const level = getLevel(percent, false);
  return (
    <div className="w-128 p-2 flex bg-white rounded-xl shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="w-24 font-semibold text-sm">{label}</span>
        <span className={`w-18 font-bold text-lg text-${level.color}-600`}>
          {points}
        </span>

        <div className="w-72 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`
            h-4 rounded-full transition-all duration-500
            bg-${level.color}-500
          `}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBarAnswer;
