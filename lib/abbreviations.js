// lib/verses.js
import { readFile } from "fs/promises";
import path from "path";

let _cache = null;

const DATA_PATH = path.join(process.cwd(), "data", "abbreviations.json");

export async function loadAbbreviations() {
  if (_cache) return _cache;
  const raw = await readFile(DATA_PATH, "utf8");
  _cache = JSON.parse(raw);
  return _cache;
}
