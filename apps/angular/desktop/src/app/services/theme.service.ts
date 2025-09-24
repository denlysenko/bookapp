import { computed, DOCUMENT, effect, inject, Injectable, Injector, signal } from '@angular/core';

import { StoragePlatformService, ThemeMode, ThemePlatformService } from '@bookapp/angular/core';

@Injectable()
export class ThemeService implements ThemePlatformService {
  readonly #document = inject(DOCUMENT);
  readonly #storageService = inject(StoragePlatformService);
  readonly #injector = inject(Injector);
  readonly #mode = signal<ThemeMode>('auto');
  readonly #isDark = computed(() => {
    const mode = this.#mode();

    if (mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return mode === 'dark';
  });

  // eslint-disable-next-line no-unused-private-class-members
  readonly #darkEffect = effect(
    () => {
      const isDark = this.#isDark();

      if (isDark) {
        this.#document.body.classList.add('dark');
      } else {
        this.#document.body.classList.remove('dark');
      }
    },
    { injector: this.#injector }
  );

  readonly mode = computed(() => this.#mode());

  initialize() {
    const mode = (this.#storageService.getItem('theme') as ThemeMode) ?? 'auto';
    this.#mode.set(mode);
  }

  toggleTheme(mode: ThemeMode) {
    this.#mode.set(mode);
    this.#storageService.setItem('theme', mode);
  }
}
