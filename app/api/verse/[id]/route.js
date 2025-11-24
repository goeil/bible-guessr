// app/api/verse/[id]/route.js
import { NextResponse } from "next/server";
import { loadVerses } from "../../../../lib/verses";

export async function GET(req, { params }) {
  const { id } = await params; // id is expected "GEN_1_1" or "PSA_23_1" etc.
  const verses = await loadVerses();
  const verse = verses[id];
  if (!verse)
    return NextResponse.json({ error: "Verse not found" }, { status: 404 });
  return NextResponse.json({ id, verse });
}
