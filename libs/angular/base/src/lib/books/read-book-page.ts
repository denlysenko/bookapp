import { Directive, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileService } from '@bookapp/angular/data-access';

@Directive()
export abstract class ReadBookBase implements OnDestroy {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #profileService = inject(ProfileService);

  readonly currentLocation = signal('');

  // TODO: move to withComponentInputBinding when Nativescript supports it
  readonly epubUrl: string = this.#activatedRoute.snapshot.data.reading.epubUrl;
  readonly bookmark: string = this.#activatedRoute.snapshot.data.reading.bookmark;

  ngOnDestroy() {
    this.#profileService
      .saveReading(this.#userId, {
        bookmark: this.currentLocation(),
        epubUrl: this.epubUrl,
      })
      .subscribe();
  }

  get #userId(): string {
    return this.#activatedRoute.snapshot.data.reading.userId;
  }
}
