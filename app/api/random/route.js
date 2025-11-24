// app/api/random/route.js
import { NextResponse } from "next/server";
import { loadVerses } from "../../../lib/verses";

export async function GET() {
  const verses = await loadVerses();
  const keys = Object.keys(verses);
  if (!keys.length)
    return NextResponse.json({ error: "No verses available" }, { status: 500 });
  const key = keys[Math.floor(Math.random() * keys.length)];
  return NextResponse.json({ id: key, verse: verses[key] });
}
