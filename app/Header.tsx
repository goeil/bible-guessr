"use client";
import Image from "next/image";

interface HeaderProps {
  currentSet: number;
  totalSets: number;
  score: number;
  onRevert: () => void;
  onNext: () => void;
  resultPresent: boolean;
}
const Header: React.FC<HeaderProps> = ({
  currentSet,
  totalSets,
  score,
  onRevert,
  onNext,
  resultPresent,
}) => {
  return (
    <header className="w-full bg-gray-800 text-white px-6 py-2 flex items-center justify-between">
      <div className="flex flex-col items-center space-x-2 me-10 gap-5">
        <Image
          src="/logo.png"
          alt="Picture of the author"
          width={170}
          height={170}
        />

        <button
          onClick={() => onRevert()}
          className="ms-8 bg-emerald-200 hover:bg-emerald-100 text-gray-700 font-semibold py-1 px-2 rounded
          text-xs
          "
        >
          ↻ Recommencer
        </button>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-8">
        <div className="text-center">
          <span className="block text-sm text-gray-300">Manche</span>
          <span className="text-lg font-semibold">
            {currentSet}
            {" / "}
            {totalSets}
          </span>
        </div>
        <div className="text-center">
          <span className="block text-sm text-gray-300">Score total</span>
          <span className="text-lg font-semibold">{score}</span>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className={`text-white py-2 px-4 
          rounded transition
          text-xl
          ${resultPresent ? "bg-indigo-500 hover:bg-indigo-600" : "bg-gray-500 cursor-not-allowed"}
          `}
          onClick={() => onNext()}
          disabled={!resultPresent}
        >
          {currentSet == totalSets ? "🔢 Voir les résultats" : "➔ Suivant"}
        </button>
      </div>
    </header>
  );
};
export default Header;
