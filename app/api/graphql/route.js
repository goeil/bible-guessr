// app/api/graphql/route.js
import { NextResponse } from "next/server";
import { buildSchema, graphql } from "graphql";
import { loadVerses } from "../../../lib/verses";

// Simple GraphQL schema
const schema = buildSchema(`
  type Verse {
    id: ID!
    book: String!
    book_id: Int!
    testament: String!
    chapter: Int!
    verse: Int!
    text: String!
  }

  type Query {
    verse(id: ID!): Verse
    randomVerse: Verse
    searchText(q: String!, limit: Int = 50): [Verse!]!
    books: [String!]!
  }
`);

const root = {
  verse: async ({ id }) => {
    const verses = await loadVerses();
    return verses[id] ? { id, ...verses[id] } : null;
  },

  randomVerse: async () => {
    const verses = await loadVerses();
    const keys = Object.keys(verses);
    const id = keys[Math.floor(Math.random() * keys.length)];
    return { id, ...verses[id] };
  },

  searchText: async ({ q, limit = 50 }) => {
    const verses = await loadVerses();
    const lq = q.toLowerCase();
    const results = [];
    for (const [id, v] of Object.entries(verses)) {
      if (v.text && v.text.toLowerCase().includes(lq)) {
        results.push({ id, ...v });
        if (results.length >= limit) break;
      }
    }
    return results;
  },

  books: async () => {
    const verses = await loadVerses();
    const set = new Set();
    for (const v of Object.values(verses)) set.add(v.book);
    return Array.from(set).sort();
  },
};

export async function POST(req) {
  const { query, variables } = await req.json().catch(() => ({}));
  if (!query) return NextResponse.json({ error: "No query" }, { status: 400 });
  const result = await graphql({
    schema,
    source: query,
    rootValue: root,
    variableValues: variables,
  });
  return NextResponse.json(result);
}

// Optional: respond to GET with a tiny GraphiQL playground for manual testing
export async function GET() {
  const html = `
  <!doctype html>
  <html>
    <head><meta charset="utf-8"><title>GraphQL Playground</title></head>
    <body>
      <h3>GraphQL endpoint</h3>
      <p>Use POST /api/graphql with JSON { "query": "...", "variables": {...} }</p>
      <pre>
query {
  randomVerse { id book chapter verse text }
}
      </pre>
    </body>
  </html>`;
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
