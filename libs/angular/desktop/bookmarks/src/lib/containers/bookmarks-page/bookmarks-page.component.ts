import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';

import { BookmarksPageBase } from '@bookapp/angular/base';
import { BookmarksService } from '@bookapp/angular/data-access';
import { BooksListComponent, PreloaderComponent } from '@bookapp/angular/ui-desktop';

@Component({
  imports: [AsyncPipe, MatToolbarModule, PreloaderComponent, BooksListComponent],
  templateUrl: './bookmarks-page.component.html',
  styleUrls: ['./bookmarks-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BookmarksService],
})
export class BookmarksPageComponent extends BookmarksPageBase {}
