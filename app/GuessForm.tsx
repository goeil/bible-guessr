import React, { useState } from "react";

import abbreviationsJson from "../data/abbreviations.json";
const abbreviations: Abbreviations = abbreviationsJson;

type Abbreviations = Record<string, string>;
interface GuessFormProps {
  onGuess: (guess: string) => void;
}

function isValidVerse(text: string, authorizedBooks: string[]): boolean {
  // Expression régulière :
  // ^       -> début de la chaîne
  // (\w+)   -> capture le livre (lettres/nombre)
  // \s+     -> au moins un espace
  // (\d+)   -> nombre du chapitre
  // :       -> caractère :
  // (\d+)   -> nombre du verset
  // $       -> fin de la chaîne
  //
  //const regex = /^([\p{L}]+)\s+(\d+):(\d+)$/u;
  //const regex = /^(\w+)\s+(\d+):(\d+)$/;
  const regex = /^(.+)\s+(\d+):(\d+)$/;

  console.log("1", text);
  const match = text.match(regex);
  console.log("match", match);
  if (!match) return false;

  const livre = match[1];
  console.log("2");
  return authorizedBooks.includes(livre);
}

// Exemple de mappage abréviation → nom complet du livre biblique
//const BOOK_ABBREVIATIONS: Record<string, string> = {
//};

const GuessForm: React.FC<GuessFormProps> = ({ onGuess }) => {
  const [guess, setGuess] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);

  // Fonction pour transformer les références
  const transformText = (text: string) => {
    //let newText = words.join(" ");
    let newText = text;
    const words = text.split(/\s/);

    const lastWord = words[words.length - 1];
    console.log("last");
    // Déclencher le remplacement après <espace>
    // donc lastWord = ""
    if (lastWord === "") {
      //const myAbbr = words[words.length - 2];
      const myAbbr = text.trim().replace(/\s+/g, " ");
      console.log("myabbr", myAbbr);
      if (myAbbr) {
        const lower = myAbbr.toLowerCase();
        if (abbreviations[lower]) {
          newText = abbreviations[lower] + " ";
        }
      }
    }

    // Transformation des chiffres "1.1" → "1:1"
    newText = newText.replace(/\b(\d+)\.(\d+)\b/g, "$1:$2");
    newText = newText.replace(/\b(\d+) (\d+)\b/g, "$1:$2");

    const valid = isValidVerse(newText, Object.values(abbreviations));
    setValid(valid);
    return newText;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const transformed = transformText(value);
    setGuess(transformed);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() === "") return;
    onGuess(guess.trim());
    setGuess(""); // reset après soumission
  };

  return (
    <div className="px-24 w-full text-center">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <input
          autoFocus={true}
          type="text"
          value={guess}
          onChange={handleChange}
          placeholder="Tapez votre réponse..."
          className="border w-92 rounded p-2 focus:outline-none focus:ring"
        />
        <button
          type="submit"
          className={`text-white py-2 px-4 
          rounded transition
          text-xl
          ${valid ? "bg-indigo-500 hover:bg-indigo-600" : "bg-gray-500 cursor-not-allowed"}
          `}
          disabled={!valid}
        >
          Soumettre
        </button>
      </form>
    </div>
  );
};

export default GuessForm;
