export function formatDate(date: number | string): string {
  const d = new Date(typeof date === 'string' ? parseInt(date, 10) : date);

  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
