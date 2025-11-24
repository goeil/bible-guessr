import { BibleRef } from "../app/BibleGame";

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
function bookScore(realId: number, guessId: number): number {
  // Exemple : moins sévère que versets → falloff léger
  return distanceScore(realId, guessId, 45, 6);
}
function chapterScore(real: number, guess: number): number {
  // Exemple : moins sévère que versets → falloff léger
  return distanceScore(real, guess, 40, 3);
}
function verseScore(real: number, guess: number): number {
  // Exemple : moins sévère que versets → falloff léger
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
    book = bookScore(guess.book_id, real.book_id);

    if (guess.book === real.book) {
      // chapitre : entre 0 et 40 points
      chapter = chapterScore(guess.chapter, real.chapter);

      if (guess.chapter === real.chapter) {
        // versets : entre 0 et 15 points
        verse = verseScore(guess.verse, real.verse);
      }
    }
  }

  let total = testament + book + chapter + verse;

  total = Math.round(total * malus);

  return {
    total,
    testament,
    book,
    chapter,
    verse,
  };
}

export const SCORE_GRID = {
  total: 100,
  testament: 5,
  book: 45,
  chapter: 40,
  verse: 10,
};
