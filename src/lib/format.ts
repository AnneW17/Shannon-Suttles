/** Human date: "12 March 2026". Editorial, unambiguous, no US/UK confusion. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Short date for tight spaces: "Mar 2026". */
export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

/** Machine-readable date for <time datetime="…">. */
export function isoDate(iso: string): string {
  return new Date(iso).toISOString().split('T')[0];
}

/** Zero-padded editorial numbering: 1 -> "01". */
export function editorialNumber(n: number): string {
  return String(n).padStart(2, '0');
}
