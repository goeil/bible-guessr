// lib/verses.js
import { readFile } from "fs/promises";
import path from "path";

let _cache = null;

const DATA_PATH = path.join(process.cwd(), "data", "segond1910.json");

export async function loadVerses() {
  if (_cache) return _cache;
  const raw = await readFile(DATA_PATH, "utf8");
  _cache = JSON.parse(raw);
  return _cache;
}

/**
 * Normalize id forms:
 * Accepts: "GEN_1_1", "Genèse 1:1", "Genese_1_1", "Psaumes 23:1"
 */
export function keyFromParts(book, chapter, verse) {
  const bookKey = book.slice(0, 3).toUpperCase();
  return `${bookKey}_${chapter}_${verse}`;
}

export function makeId(book, chapter, verse) {
  // canonical id used in the JSON keys: using first 3 letters (works with French book names as used in JSON)
  const bk = book.slice(0, 3).toUpperCase();
  return `${bk}_${chapter}_${verse}`;
}
