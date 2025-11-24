import React from "react";
import { getLevel } from "./ResultCard";
import ProgressBarAnswer from "./ProgressBarAnswer";
import Stars from "./Stars";
import { bibleRefToString, getTotalScore, Result } from "./BibleGame";
import { SCORE_GRID } from "../lib/score";

//points={getTotalScore(game)}
interface FinalResultProps {
  game: Result[];
  //points: number;
  //percent: number;
}

const FinalResult: React.FC<FinalResultProps> = ({ game }) => {
  const points = getTotalScore(game);
  const percent = (100 * points) / (100 * game.length);
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
          w-full max-w-xl mx-auto space-y-4
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
          <div className="flex flex-col md:flex-row gap-4 mx-auto mt-4">
            {game.map((result, k) => {
              const percent = (100 * result.score.total) / SCORE_GRID.total;
              const level = getLevel(percent);

              return (
                <span
                  key={k}
                  className="flex flex-row items-center text-sm font-medium text-heading me-3"
                >
                  <span
                    className={`flex w-2.5 h-2.5 
                    bg-${level.color}-500
                    rounded-full me-1.5 shrink-0`}
                  ></span>
                  <span
                    className={`
                    text-${level.color}-600
font-semibold
                      `}
                  >
                    {bibleRefToString(result.solution, true)}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalResult;
