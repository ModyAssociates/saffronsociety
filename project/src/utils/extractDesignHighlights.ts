// utils/extractDesignHighlights.ts
export interface HighlightItem {
  label: string;
  detail: string;
}

/**
 * Works with raw text like:
 *
 * 🐾 Design Highlights:
 * Ace of Spades: The ultimate symbol ...
 * Silhouette Mystery: Ajay’s iconic cap ...
 * ...
 */
export function extractDesignHighlights(description = ''): HighlightItem[] {
  if (typeof window === 'undefined') return [];

  // 1. Decode HTML entities (&mdash; → —)
  const textarea = document.createElement('textarea');
  textarea.innerHTML = description;
  const decoded = textarea.value;

  // 2. Split into trimmed non-empty lines
  const lines = decoded
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  // 3. Locate the “Design Highlights” heading
  const start = lines.findIndex(l => /design highlights/i.test(l));
  if (start === -1) return [];

  // 4. Collect subsequent lines until we hit the next emoji section
  const emojiHeadRx = /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const items: HighlightItem[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];

    // Stop when the next section starts (line begins with an emoji)
    if (emojiHeadRx.test(line)) break;

    // Only keep “Title: detail” lines
    const colon = line.indexOf(':');
    if (colon === -1) continue;

    const label = line.slice(0, colon).replace(/^[\-\*•]\s*/, '').trim();
    const detail = line.slice(colon + 1).trim();
    if (label && detail) items.push({ label, detail });
  }

  return items;
}
