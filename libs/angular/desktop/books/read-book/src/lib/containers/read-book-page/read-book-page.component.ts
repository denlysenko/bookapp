import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReadBookBase } from '@bookapp/angular/base';
import { ProfileService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-read-book-page',
  templateUrl: './read-book-page.component.html',
  styleUrls: ['./read-book-page.component.scss'],
})
export class ReadBookPageComponent extends ReadBookBase {
  constructor(route: ActivatedRoute, profileService: ProfileService) {
    super(route, profileService);
  }
}
