import { readFileSync } from "node:fs";
import path from "node:path";

import meeting from "@/content/grad-school/randolph/greek-1/meeting.json";
import meta from "@/content/grad-school/randolph/greek-1/questions.meta.json";

const QUESTIONS_FILE = path.join(
  process.cwd(),
  "content/grad-school/randolph/greek-1/questions.md",
);

export type Meeting = typeof meeting;

export type QuestionSection = { heading: string | null; items: string[] };

const MARKER = /^(?:\d+[.)]|[-*+])\s+/;

/**
 * Parses the Obsidian note into sections of questions.
 *
 * - A line starting with a list marker ("1.", "1)", "-") starts a new
 *   question; unmarked lines right after it continue that question.
 * - Blank lines separate blocks. A block of unmarked lines whose first line
 *   is followed by more lines becomes a section: first line = heading, each
 *   remaining line = one question (e.g. "Unit 2 G2E Sentences Questions"
 *   followed by "3, 10" / "18, word order: ...").
 * - Any other unmarked block is one question.
 *
 * The page numbers the list itself, so leading markers are dropped (display
 * only; the file stays verbatim).
 */
export function getGreekQuestionSections(): QuestionSection[] {
  const raw = readFileSync(QUESTIONS_FILE, "utf8").replace(/\r\n?/g, "\n");
  const sections: QuestionSection[] = [{ heading: null, items: [] }];
  const current = () => sections[sections.length - 1];

  for (const block of raw.split(/\n[ \t]*\n/)) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    if (lines.some((l) => MARKER.test(l))) {
      for (const line of lines) {
        const items = current().items;
        if (MARKER.test(line) || items.length === 0) {
          items.push(line.replace(MARKER, ""));
        } else {
          items[items.length - 1] += `\n${line}`;
        }
      }
    } else if (lines.length > 1) {
      sections.push({ heading: lines[0], items: lines.slice(1) });
    } else {
      current().items.push(lines[0]);
    }
  }

  return sections.filter((s) => s.heading || s.items.length > 0);
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
