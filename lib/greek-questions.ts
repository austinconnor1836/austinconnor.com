import { readFileSync } from "node:fs";
import path from "node:path";

import meeting from "@/content/grad-school/randolph/greek-1/meeting.json";
import meta from "@/content/grad-school/randolph/greek-1/questions.meta.json";

const QUESTIONS_FILE = path.join(
  process.cwd(),
  "content/grad-school/randolph/greek-1/questions.md",
);

export type Meeting = typeof meeting;

/**
 * Each paragraph of the Obsidian note is one question. Paragraphs are
 * separated by one or more blank lines; line breaks inside a paragraph are
 * kept as written.
 */
export function getGreekQuestions(): string[] {
  const raw = readFileSync(QUESTIONS_FILE, "utf8").replace(/\r\n?/g, "\n");
  return raw
    .split(/\n[ \t]*\n/)
    .map((p) => p.replace(/^\s+|\s+$/g, ""))
    // The page numbers the list itself, so drop a leading "1." / "1)" / "-"
    // marker if the note has one (display only; the file stays verbatim).
    .map((p) => p.replace(/^(?:\d+[.)]|[-*+])\s+/, ""))
    .filter(Boolean);
}

export function getMeeting(): Meeting {
  return meeting;
}

/** ISO date (YYYY-MM-DD) the note last changed, written by scripts/sync-greek-questions.sh. */
export function getLastUpdated(): string {
  return meta.lastUpdated;
}

export function formatLongDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
