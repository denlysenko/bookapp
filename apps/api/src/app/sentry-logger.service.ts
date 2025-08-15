/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';

@Injectable()
export class SentryLogger extends ConsoleLogger implements LoggerService {
  log(message: any, context?: string): void {
    this.captureMessage('info', message, context);
    super.log(message, context);
  }

  error(message: any, stack?: string, context?: string): void {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    Sentry.logger.error(msg, { context, stack });
    super.error(message, stack, context);
  }

  warn(message: any, context?: string): void {
    this.captureMessage('warn', message, context);
    super.warn(message, context);
  }

  debug(message: any, context?: string): void {
    this.captureMessage('debug', message, context);
    super.debug(message, context);
  }

  verbose(message: any, context?: string): void {
    this.captureMessage('info', message, context);
    super.verbose(message, context);
  }

  private captureMessage(level: string, message: any, context?: string): void {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    Sentry.logger[level](msg, { context });
  }
}
