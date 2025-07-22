export interface HighlightItem {
  label: string;
  detail: string;
}

/**
 * Pull every <li> inside the “Design Highlights” section.
 * – Works with either HTML or Markdown rendered to HTML
 * – Returns an array of { label, detail }
 */
export function extractDesignHighlights(description = ''): HighlightItem[] {
  if (typeof window === 'undefined') return [];

  // Parse the markup
  const doc = new DOMParser().parseFromString(description, 'text/html');

  // Locate the heading
  const heading = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5'))
    .find(h => /design highlights/i.test(h.textContent ?? ''));
  if (!heading) return [];

  // Grab the first <ul> that follows
  let ul = heading.nextElementSibling as HTMLElement | null;
  while (ul && ul.tagName.toLowerCase() !== 'ul') {
    ul = ul.nextElementSibling as HTMLElement | null;
  }
  if (!ul) return [];

  // Map every <li>
  return Array.from(ul.querySelectorAll('li')).map(li => {
    const raw = li.textContent?.trim() ?? '';
    const [label, ...rest] = raw.split(':');
    return { label: label.trim(), detail: rest.join(':').trim() };
  });
}
