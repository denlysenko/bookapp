import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BookmarksPageBase } from '@bookapp/angular/base';
import { BookmarksService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-bookmarks-page',
  templateUrl: './bookmarks-page.component.html',
  styleUrls: ['./bookmarks-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BookmarksService],
})
export class BookmarksPageComponent extends BookmarksPageBase {
  constructor(route: ActivatedRoute, bookmarksService: BookmarksService) {
    super(route, bookmarksService);
  }
}
