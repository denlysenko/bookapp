import { computed, inject, Injectable, signal } from '@angular/core';

import { StoragePlatformService, ThemeMode, ThemePlatformService } from '@bookapp/angular/core';

import Theme from '@nativescript-community/css-theme';
import { Application } from '@nativescript/core';

@Injectable()
export class ThemeService implements ThemePlatformService {
  readonly #storageService = inject(StoragePlatformService);
  readonly #mode = signal<ThemeMode>('auto');

  readonly mode = computed(() => this.#mode());
  readonly dark = computed(() => {
    const mode = this.#mode();

    if (mode === Theme.Auto) {
      return Application.systemAppearance() === Theme.Dark;
    }

    return mode === Theme.Dark;
  });

  initialize() {
    const initialTheme = (this.#storageService.getItem('theme') as ThemeMode) ?? Theme.Auto;
    Theme.currentMode = initialTheme;
    this.#mode.set(initialTheme as ThemeMode);
    this.#storageService.removeItem('theme');
    Application.on(Application.systemAppearanceChangedEvent, ({ newValue }) => {
      Theme.setMode(newValue);
      this.#mode.set(newValue);
      const rootView = Application.getRootView();
      rootView?._onCssStateChange();
      rootView?._getRootModalViews()?.forEach((view) => {
        view?._onCssStateChange();
      });
    });
  }

  toggleTheme(mode: ThemeMode) {
    Theme.setMode(mode, undefined, undefined, true);
    this.#mode.set(mode);
    this.#storageService.setItem('theme', mode);
  }
}
