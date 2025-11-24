"use client";
import React, { useEffect, useState } from "react";
import { computeScore } from "../lib/score";
import GuessForm from "./GuessForm";
import ResultCard from "./ResultCard";
import FinalResult from "./FinalResult";
import Header from "./Header";
import TextDisplay from "./TextDisplay";

import abbreviationsJson from "../data/abbreviations_officielles.json";
const abbreviations: Record<string, string> = abbreviationsJson;

interface BibleGameProps {
  sets: number;
  contextWidth: number;
  malusForHelp: number;
}

export type BibleRef = {
  text?: string;
  book: string;
  book_abbr: string;
  testament: "AT" | "NT";
  chapter: number;
  verse: number;
};
export type BibleText = {
  id: string;
  verse: string;
  before?: string;
  after?: string;
};
export type Result = {
  score: Score;
  guess: BibleRef;
  solution: BibleRef;
};
export type Score = {
  total: number;
  testament: number;
  book: number;
  chapter: number;
  verse: number;
  malus: number;
};
export type Book = {
  name: string;
  testament: "AT" | "NT";
};
export function bibleRefToString(ref: BibleRef, short?: boolean): string {
  let book = ref.book;
  //if (short) book = abbreviations[book];
  if (short) book = ref.book_abbr;
  return book + " " + ref.chapter + ":" + ref.verse;
}

export function getTotalScore(results: Result[]) {
  return results.reduce(
    (acc, r) => acc + Math.ceil(r.score.total * r.score.malus),
    0,
  );
}

const BibleGame: React.FC<BibleGameProps> = ({
  sets,
  contextWidth,
  malusForHelp,
}) => {
  const [game, setGame] = useState<Result[]>([]);
  const [currentSet, setCurrentSet] = useState<number>(1);

  const [text, setText] = useState<BibleText | null>(null);
  const [current, setCurrent] = useState<BibleRef | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>();
  const [books, setBooks] = useState<Book[] | null>(null);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  async function reinit() {
    setGameFinished(false);
    setCurrentSet(1);
    setGame([]);
    loadRandom();
  }

  async function nextSet() {
    console.log("curr", currentSet);
    console.log("sets", sets);
    if (currentSet == sets) {
      // on arrive à la fin du jeu
      setGameFinished(true);
      setResult(null);
    } else {
      setCurrentSet((prev) => prev + 1);
      loadRandom();
    }
  }
  async function loadRandom() {
    setLoading(true);
    const res = await fetch("/api/random");
    const data = await res.json();
    const myVerse = data.verse as BibleRef;
    myVerse.book_abbr = abbreviations[myVerse.book];

    setCurrent(myVerse);
    setText({ verse: data.verse.text, id: data.id });
    setResult(null);
    setLoading(false);
  }
  async function loadBooks() {
    const res = await fetch("/api/books");
    const data = await res.json();
    console.log(data.books);
    setBooks(data.books);
  }

  async function addContext() {
    if (text) {
      const res = await fetch(`/api/context/${text.id}/${contextWidth}`);
      const { after, before } = await res.json();
      setText({ ...text, after, before });
    }
  }
  /**
   * Transforme une string type "1 Samuel 3:17" en BibleRef
   */
  const parseBibleRef = (input: string, books: Book[]): BibleRef | null => {
    const trimmed = input.trim();
    const match = trimmed.match(/^(.+)\s+(\d+):(\d+)$/);
    if (!match) return null;

    const [, bookName, chapterStr, verseStr] = match;
    const chapter = parseInt(chapterStr, 10);
    const verse = parseInt(verseStr, 10);

    console.log("bookName", bookName);
    // Recherche insensible à la casse
    const book = books.find(
      (b) => b.name.toLowerCase() === bookName.toLowerCase(),
    );

    console.log("bookName", book);
    if (!book) {
      return null;
    }

    return {
      book: book.name,
      book_abbr: abbreviations[book.name],
      testament: book.testament,
      chapter,
      verse,
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRandom();
      loadBooks();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!text) {
    return <>⌛ Je charge un verset…</>;
  }
  return (
    <div className="min-h-screen bg-[#f8f4ec] flex flex-col items-center p-6 gap-6">
      <Header
        currentSet={currentSet}
        totalSets={sets}
        score={getTotalScore(game)}
        onRevert={() => reinit()}
        onNext={() => nextSet()}
        resultPresent={result !== null}
      />
      {!gameFinished && (
        <>
          {loading && <p className="text-lg">Chargement...</p>}

          {!loading && current && !result && (
            <div className="max-w-2xl w-full text-center">
              <div className="mt-1">
                <GuessForm
                  onGuess={(guess: string) => {
                    console.log("guess!", guess);
                    if (books) {
                      const ref = parseBibleRef(guess, books);
                      console.log("ref!", ref);
                      if (ref) {
                        const score = computeScore(
                          current,
                          ref,
                          text.after != undefined || text.before != undefined
                            ? malusForHelp
                            : 1,
                        );
                        const result = {
                          score: score,
                          guess: ref,
                          solution: current,
                        };
                        setResult(result);
                        setGame((prev) => [...prev, result]);
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-8">
                <TextDisplay text={text} onHelp={() => addContext()} />
              </div>
            </div>
          )}

          {result && <ResultCard result={result} malus={malusForHelp} />}
        </>
      )}

      {gameFinished && <FinalResult game={game} />}
    </div>
  );
};

export default BibleGame;
