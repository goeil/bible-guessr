// app/api/books/route.js
import { NextResponse } from "next/server";
import { loadVerses } from "../../../lib/verses";

export async function GET() {
  const verses = await loadVerses();
  // build unique books with id and testament (first encountered)
  const booksMap = new Map();
  for (const v of Object.values(verses)) {
    if (!booksMap.has(v.book)) {
      booksMap.set(v.book, {
        name: v.book,
        book_id: v.book_id,
        testament: v.testament,
      });
    }
  }
  const list = Array.from(booksMap.values()).sort(
    (a, b) => a.book_id - b.book_id,
  );
  return NextResponse.json({ count: list.length, books: list });
}
