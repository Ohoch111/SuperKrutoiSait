export function formatBand(score: number): string {
  return Number.isInteger(score) ? score.toFixed(1) : score.toFixed(1);
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function generateId(): string {
  return crypto.randomUUID();
}
