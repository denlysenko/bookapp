import { OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileService } from '@bookapp/angular/data-access';

export abstract class ReadBookBase implements OnDestroy {
  currentLocation: string;

  readonly epubUrl: string = this.route.snapshot.data.epubUrl;
  readonly bookmark: string = this.route.snapshot.data.bookmark;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {}

  ngOnDestroy() {
    this.profileService
      .saveReading(this.userId, { bookmark: this.currentLocation, epubUrl: this.epubUrl })
      .subscribe();
  }

  private get userId(): string {
    return this.route.snapshot.data.userId;
  }
}
