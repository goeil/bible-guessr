import React from "react";
import { getLevel } from "./ResultCard";
import ProgressBarAnswer from "./ProgressBarAnswer";
import Stars from "./Stars";

interface FinalResultProps {
  points: number;
  percent: number;
}

const FinalResult: React.FC<FinalResultProps> = ({ points, percent }) => {
  const level = getLevel(percent);
  return (
    <div
      className={`
        p-6 rounded-2xl shadow-lg border-2
        bg-${level.color}-50 border-${level.color}-400
        transition-all duration-300
        flex flex-col items-center justify-center 
        text-center gap-2 w-full max-w-2xl
      `}
    >
      {/* Score dynamique avec pop */}
      <div
        className={`
          text-2xl font-bold mb-2 text-center
          transform transition-transform duration-500
          ${level.scale ? "scale-" + level.scale : "scale-100"}
          text-${level.color}-600
        `}
      >
        <div className="flex flex-col gap-4 text-center">
          <span className="text-xl">Votre score final</span>
          <span className="text-8xl">{points}</span>
          <span className="">
            <Stars percent={percent} />
          </span>
          <span className="mt-8">
            <ProgressBarAnswer label="" points={points} percent={percent} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinalResult;
