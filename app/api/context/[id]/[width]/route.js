// app/api/context/[id]/route.js
import { NextResponse } from "next/server";
import { loadVerses } from "../../../../../lib/verses";

function getContextFromObject(data, id, n = 3) {
  const keys = Object.keys(data); // conserve l'ordre d'insertion du JSON
  const idx = keys.indexOf(id);
  if (idx === -1) return { before: [], after: [] };

  const startBefore = Math.max(0, idx - n);
  const beforeKeys = keys.slice(startBefore, idx);
  const afterKeys = keys.slice(idx + 1, idx + 1 + n);

  //const before = beforeKeys.map((k) => ({ id: k, value: data[k] }));
  //const after = afterKeys.map((k) => ({ id: k, value: data[k] }));
  const before = beforeKeys.map((k) => data[k].text).join(" ");
  const after = afterKeys.map((k) => data[k].text).join(" ");

  return { before, after };
}

export async function GET(req, { params }) {
  console.log("GET");
  const { id, width } = await params; // id is expected "GEN_1_1" or "PSA_23_1" etc.
  const w = parseInt(width);
  console.log(id + width);
  const verses = await loadVerses();
  const context = getContextFromObject(verses, id, w);
  if (!context)
    return NextResponse.json({ error: "Verse not found" }, { status: 404 });
  return NextResponse.json(context);
}
