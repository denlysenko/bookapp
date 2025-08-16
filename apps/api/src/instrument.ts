import * as Sentry from '@sentry/nestjs';

function getLevels(minimal = 'error'): string[] {
  const levels = ['error', 'warn', 'log', 'debug', 'verbose'];
  const minimalIndex = levels.indexOf(minimal);

  if (minimalIndex === -1) {
    return [...levels];
  }

  return levels.slice(0, minimalIndex + 1);
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
  enableLogs: true,
  enabled: process.env.NODE_ENV === 'production',
  beforeSendLog: (log) => {
    const levels = getLevels(process.env.LOG_LEVEL);
    return levels.includes(log.level) ? log : null;
  },
});
