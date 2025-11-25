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
    <header
      className="w-full 
      bg-gray-800 text-white 
      px-4 py-2 
      flex flex-col md:flex-row 
      items-center justify-between 
      gap-2 md:gap-0
      text-sm
      "
    >
      {/* Logo + Recommencer */}
      <div className="flex flex-row items-center gap-8">
        <Image
          src="/logo.png"
          alt="Logo"
          width={80}
          height={80}
          className="md:w-40 md:h-20"
        />
        <button
          onClick={onRevert}
          className="bg-emerald-200 hover:bg-emerald-100 
          text-gray-700 font-semibold 
          py-1 px-2 rounded 
          text-xs md:text-xs"
        >
          ↻ Nouvelle partie
        </button>
      </div>

      {/* Manche + Score */}
      <div className="flex flex-row items-center gap-8 text-center">
        <div>
          <span className="block text-xs md:text-sm text-gray-300">Manche</span>
          <span className="text-base md:text-xl font-semibold">
            {currentSet} / {totalSets}
          </span>
        </div>
        <div>
          <span className="block text-xs md:text-sm text-gray-300">
            Score total
          </span>
          <span className="text-base md:text-xl font-semibold">{score}</span>
        </div>
      </div>

      {/* Bouton Suivant */}
      <div>
        <button
          type="submit"
          className={`text-white py-2 px-4 rounded transition text-xl md:text-lg
        ${resultPresent ? "bg-indigo-500 hover:bg-indigo-600" : "bg-gray-500 cursor-not-allowed"}`}
          onClick={onNext}
          disabled={!resultPresent}
        >
          {currentSet == totalSets ? "🔢 Voir les résultats" : "➔ Suivant"}
        </button>
      </div>
    </header>
  );
};
export default Header;
