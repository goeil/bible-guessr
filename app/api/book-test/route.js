// app/api/books/route.js
import { NextResponse } from "next/server";
import { loadVerses } from "../../../lib/verses";
import abbreviationsJson from "../../../data/abbreviations_officielles.json";
const abbreviations = abbreviationsJson;

export async function GET() {
  const verses = await loadVerses();
  // build unique books with id and testament (first encountered)
  const booksMap = new Map();
  for (const v of Object.values(verses)) {
    if (!booksMap.has(v.book)) {
      booksMap.set(v.book, {
        name: v.book,
        testament: v.testament,
      });
    }
  }
  const list = Array.from(booksMap.values());
  list.forEach((val) => {
    console.log(abbreviations[val.name] + "\t" + val.name);
  });
  return NextResponse.json({ count: list.length, books: list });
}
