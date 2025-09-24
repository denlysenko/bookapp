import { Signal } from '@angular/core';

export type ThemeMode = 'auto' | 'light' | 'dark';

export abstract class ThemePlatformService {
  abstract readonly mode: Signal<ThemeMode>;
  abstract initialize(): void;
  abstract toggleTheme(mode: ThemeMode): void;
}
