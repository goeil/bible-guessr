import { BibleRef } from "../app/BibleGame";
import { getDistance } from "./book_closeness.js";

/**
 * Calcule un score en fonction de la distance entre deux nombres.
 * maxScore : score si exact
 * falloff : combien de points en moins par unité de distance
 */
export function distanceScore(
  real: number,
  guess: number,
  maxScore = 100,
  falloff = 20,
): number {
  const dist = Math.abs(real - guess);
  const score = Math.max(0, maxScore - dist * falloff);
  return score;
}
function bookScore(guess: BibleRef, real: BibleRef): number {
  // 45 points en tout, 6 points de moins par éloignement
  // 24.11.2025 : amélioration : matrice de correspondance entre livres
  //    bibliques, qui donne un résultat entre 0 et 100.
  //    return distanceScore(realId, guessId, 45, 6);

  const score = getDistance(guess.book_abbr, real.book_abbr);
  return Math.ceil((score * 45) / 100);
}
function chapterScore(guess: number, real: number): number {
  // 40 points en tout, 3 points de moins par éloignement d'un chaptre
  return distanceScore(real, guess, 40, 3);
}
function verseScore(guess: number, real: number): number {
  // 10 points en tout, 1 point de moins par éloignement d'un verset
  return distanceScore(real, guess, 10, 1);
}

export function computeScore(real: BibleRef, guess: BibleRef, malus: number) {
  // Testament : 0 ou 5
  let testament = 0,
    book = 0,
    chapter = 0,
    verse = 0;
  if (guess.testament === real.testament) {
    testament = 5;

    // livre : entre 0 et 45 points
    book = bookScore(guess, real);

    if (guess.book === real.book) {
      // chapitre : entre 0 et 40 points
      chapter = chapterScore(guess.chapter, real.chapter);

      if (guess.chapter === real.chapter) {
        // versets : entre 0 et 15 points
        verse = verseScore(guess.verse, real.verse);
      }
    }
  }

  const total = testament + book + chapter + verse;

  //total = Math.round(total * malus);

  return {
    total,
    testament,
    book,
    chapter,
    verse,
    malus,
  };
}

export const SCORE_GRID = {
  total: 100,
  testament: 5,
  book: 45,
  chapter: 40,
  verse: 10,
};
