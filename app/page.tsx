// Next.js 14+ (app router) ScriptureGuessr-like UI
// This is a complete UI page styled cleanly with Tailwind.
// File: app/game/page.jsx

import BibleGame from "./BibleGame";

export default function GamePage() {
  return <BibleGame sets={6} contextWidth={3} malusForHelp={0.5} />;
}
