// Fortune Cookie Wisdom for Developers — make.fun entry
//
// A small deterministic Node program. It holds one original fortune-cookie
// line for a software developer, checks the line against the competition's
// sealed gate (UTF-8 text, 1 to 120 characters, not only white space), and
// writes it to entry.txt inside the output directory the grader provides.
//
// The line itself was written for this entry: a TODO left in the code is a
// note to whoever reads it next, and whoever reads it next is usually the
// same person, months later, no longer recognising their own handwriting.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The fortune
// ---------------------------------------------------------------------------

// One short balanced sentence that lands in a single breath. The twist is
// quiet: the "stranger" is the author's own future self, so the letter is
// both a warning and a confession.
const FORTUNE =
  "Every TODO you leave behind is a letter to a stranger who shares your name.";

// The competition's gate, as published in the kit's competition.yaml:
// entry.txt must be UTF-8 text of 1 to 120 characters, not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 120;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count characters the way the gate does: Unicode code points, not bytes. */
function charCount(text: string): number {
  return [...text].length;
}

/** A fortune cookie lands as one balanced sentence in a single breath. */
function isSingleSentence(text: string): boolean {
  if (!text.endsWith(".")) return false;
  const sentences = text.split(".").filter((part) => part.trim().length > 0);
  return sentences.length === 1;
}

/**
 * Validate a candidate line against the gate plus the fortune-cookie shape
 * the judge reads for: one line, one sentence, no leading or trailing
 * whitespace, and inside the 1–120 character window.
 */
function validateFortune(text: string): void {
  if (typeof text !== "string") {
    throw new Error("entry must be a string");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  const length = charCount(text);
  if (length < MIN_CHARS) {
    throw new Error(`entry is empty, below the ${MIN_CHARS} character minimum`);
  }
  if (length > MAX_CHARS) {
    throw new Error(`entry is ${length} characters, over the ${MAX_CHARS} limit`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  // Control characters would survive as invisible bytes in entry.txt and
  // break the "reads like a fortune cookie" shape, so reject them outright.
  if (/[\u0000-\u001f\u007f]/.test(text)) {
    throw new Error("entry must not contain control characters");
  }
  if (!isSingleSentence(text)) {
    throw new Error("entry must be exactly one sentence ending with a full stop");
  }
}

/** Resolve the output directory the grader hands the program. */
function outputDir(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  if (dir.trim().length === 0) {
    throw new Error("MAKEFUN_OUTPUT_DIR must not be empty");
  }
  return dir;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

// Fail loudly before writing anything: an invalid line must never reach
// the judge as a silent zero.
validateFortune(FORTUNE);

const out = outputDir();
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "entry.txt"), FORTUNE, "utf8");
