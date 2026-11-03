export interface Memory {
  id: string;
  text: string;
  createdAt: number;
}

const STORAGE_KEY = "nexus-premium-memory";
const MAX_MEMORIES = 50;

export function loadMemories(): Memory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Memory[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMemories(memories: Memory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch {
    /* storage unavailable */
  }
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Adds memories, skipping duplicates. Returns the updated list and the newly added texts. */
export function addMemories(current: Memory[], texts: string[]): { list: Memory[]; added: string[] } {
  let list = [...current];
  const added: string[] = [];
  for (const raw of texts) {
    const text = raw.trim();
    if (!text) continue;
    if (list.some((m) => m.text.toLowerCase() === text.toLowerCase())) continue;
    list = [{ id: makeId(), text, createdAt: Date.now() }, ...list].slice(0, MAX_MEMORIES);
    added.push(text);
  }
  return { list, added };
}

const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const stop = "[^.,!?;\\n]";

/** Pulls personal facts out of a user message in simple language. */
export function extractFacts(message: string): string[] {
  const facts: string[] = [];
  const text = message.trim();
  const take = (re: RegExp, format: (m: string) => string) => {
    const match = text.match(re);
    if (match && match[1]) {
      const value = clean(match[1]);
      if (value.length >= 2 && value.length <= 60) facts.push(format(value));
    }
  };

  take(new RegExp(`\\bremember(?: that)?\\s+(?!that\\b)(${stop}{3,120})`, "i"), (v) => v);
  take(new RegExp(`\\bremember(?: that)?\\s+that\\s+(${stop}{3,120})`, "i"), (v) => v);
  take(new RegExp(`\\bmy name is\\s+([\\p{L}][\\p{L}'\\- ]{0,30})`, "iu"), (v) => `Name: ${v}`);
  take(new RegExp(`\\bcall me\\s+([\\p{L}][\\p{L}'\\- ]{0,30})`, "iu"), (v) => `Name: ${v}`);
  take(new RegExp(`\\bi(?:'m| am) an? (${stop}{2,40})`, "i"), (v) => `Is a ${v}`);
  take(new RegExp(`\\bi (?:really )?(?:like|love|enjoy|prefer) (${stop}{2,40})`, "i"), (v) => `Likes ${v}`);
  take(new RegExp(`\\bi (?:live|am based) in (${stop}{2,40})`, "i"), (v) => `Lives in ${v}`);
  take(new RegExp(`\\bi work (?:as|at|for) (${stop}{2,40})`, "i"), (v) => `Works ${v}`);
  const fav = text.match(new RegExp(`\\bmy favou?rite (${stop}{2,20}) is (${stop}{2,40})`, "i"));
  if (fav) facts.push(`Favorite ${clean(fav[1])}: ${clean(fav[2])}`);

  return facts.filter(Boolean);
}

export function findName(memories: Memory[]): string | null {
  const m = memories.find((x) => x.text.startsWith("Name: "));
  return m ? m.text.slice("Name: ".length) : null;
}

export type MemoryIntent =
  | { type: "list" }
  | { type: "clear" }
  | { type: "forget"; target: string }
  | { type: "name" }
  | null;

export function detectMemoryIntent(message: string): MemoryIntent {
  const t = message.trim();
  if (/\b(what do you (remember|know) about me|what do you remember|show (my )?memor(y|ies))\b/i.test(t)) {
    return { type: "list" };
  }
  if (/\b(forget everything|forget all|clear (your |my )?memor(y|ies))\b/i.test(t)) {
    return { type: "clear" };
  }
  const forget = t.match(/^forget\s+(?:that\s+|about\s+)?(.{2,80})$/i);
  if (forget) return { type: "forget", target: clean(forget[1]) };
  if (/\bwhat(?:'s| is) my name\b/i.test(t)) return { type: "name" };
  return null;
}

export function forgetMatching(memories: Memory[], target: string): { list: Memory[]; removed: number } {
  const needle = target.toLowerCase();
  const list = memories.filter((m) => !m.text.toLowerCase().includes(needle));
  return { list, removed: memories.length - list.length };
}
