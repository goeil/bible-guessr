"use client";
import { BibleText } from "./BibleGame";

interface TextDisplayProps {
  text: BibleText | null;
  onHelp: () => void;
}
const TextDisplay: React.FC<TextDisplayProps> = ({ text, onHelp }) => {
  if (!text) return <div>pas de texte !</div>;

  console.log(text);
  return (
    <div className="m-4 bg-white rounded-2xl shadow p-6 text-2xl leading-relaxed font-serif">
      <div className="text-gray-300">{text.before}</div>
      <div className="text-gray-800">{text.verse}</div>
      <div className="text-gray-300">{text.after}</div>
      {!text.before && !text.after && (
        <button
          onClick={() => onHelp()}
          className="ms-8 bg-indigo-200 hover:bg-indigo-300 text-gray-700 font-semibold py-1 px-2 rounded
          text-xs
          "
        >
          💡 Voir le contexte
        </button>
      )}
    </div>
  );
};
export default TextDisplay;
