// app/api/search/route.js
import { NextResponse } from "next/server";
import { loadVerses } from "../../../lib/verses";

export async function GET(req) {
  const verses = await loadVerses();
  const url = new URL(req.url);
  const q = url.searchParams.get("q"); // recherche plein-texte
  const book = url.searchParams.get("book"); // ex: "Psaumes" ou "Genèse"
  const chapter = url.searchParams.get("chapter");
  const verseNum = url.searchParams.get("verse");

  // filter by explicit book/chapter/verse if present
  if (book && chapter && verseNum) {
    // find key(s) that match (book writing in JSON must match exactly)
    const results = Object.entries(verses)
      .filter(
        ([k, v]) =>
          v.book === book &&
          v.chapter === Number(chapter) &&
          v.verse === Number(verseNum),
      )
      .map(([id, v]) => ({ id, verse: v }));
    return NextResponse.json({ count: results.length, results });
  }

  // text search (simple substring, case-insensitive)
  if (q) {
    const ql = q.toLowerCase();
    const results = Object.entries(verses)
      .filter(([k, v]) => v.text && v.text.toLowerCase().includes(ql))
      .slice(0, 200)
      .map(([id, v]) => ({ id, verse: v }));
    return NextResponse.json({ count: results.length, results });
  }

  // if only book provided, return list of chapters present
  if (book) {
    const chapters = new Set();
    for (const v of Object.values(verses)) {
      if (v.book === book) chapters.add(v.chapter);
    }
    return NextResponse.json({
      book,
      chapters: Array.from(chapters).sort((a, b) => a - b),
    });
  }

  return NextResponse.json({ error: "no query" }, { status: 400 });
}
