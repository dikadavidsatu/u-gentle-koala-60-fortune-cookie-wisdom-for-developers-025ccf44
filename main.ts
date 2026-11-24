import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "The code you refuse to delete today will review you, line by line, in production tomorrow.";

function validate(text: string): void {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("entry must be non-empty");
  }
  if (text.length > 120) {
    throw new Error(`entry is ${text.length} characters, over the 120 limit`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  // A fortune cookie lands as one balanced sentence in a single breath.
  if (!text.endsWith(".")) {
    throw new Error("entry must end with a full stop");
  }
  const sentences = text.split(".").filter((part) => part.trim().length > 0);
  if (sentences.length !== 1) {
    throw new Error("entry must be exactly one sentence");
  }
}

validate(TEXT);

const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "entry.txt"), TEXT, "utf8");
