export function dateToPeriod(date: number): string {
  const diff = Math.floor((Date.now() - date) / 1000);

  let interval = Math.floor(diff / 31536000);

  if (interval > 1) {
    return `${interval} year ago`;
  }

  interval = Math.floor(diff / 2592000);

  if (interval > 1) {
    return `${interval} months ago`;
  }

  interval = Math.floor(diff / 86400);

  if (interval >= 1) {
    return `${interval} days ago`;
  }

  interval = Math.floor(diff / 3600);

  if (interval >= 1) {
    return `${interval} hours ago`;
  }

  interval = Math.floor(diff / 60);

  if (interval > 1) {
    return `${interval} minutes ago`;
  }

  return `${diff} seconds ago`;
}
