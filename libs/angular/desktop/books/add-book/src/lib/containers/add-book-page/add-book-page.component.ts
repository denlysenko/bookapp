import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { AddBookService } from '@bookapp/angular/data-access';
import { ConfirmDialogComponent } from '@bookapp/angular/ui-desktop';
import { ApiError, Book, BookFormModel } from '@bookapp/shared/interfaces';

import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { AddBookFormComponent } from '../../components/add-book-form/add-book-form.component';

const BOOK_CREATED = 'Book created!';
const BOOK_UPDATED = 'Book updated!';
const UNSAVED_CHANGES_WARNING =
  'There are unsaved changes on the page. Are you sure you want to leave?';

@Component({
  imports: [AsyncPipe, MatCardModule, AddBookFormComponent],
  templateUrl: './add-book-page.component.html',
  styleUrls: ['./add-book-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBookPageComponent {
  readonly bookFormComponent = viewChild(AddBookFormComponent);

  readonly #feedbackService = inject(FeedbackPlatformService);
  readonly #dialog = inject(MatDialog);
  readonly #booksService = inject(AddBookService);
  readonly #activatedRoute = inject(ActivatedRoute);

  readonly book$: Observable<Book> = this.#activatedRoute.data.pipe(map((data) => data.book));

  readonly loading = signal(false);
  readonly error = signal<ApiError>(null);

  save(book: BookFormModel) {
    const { id, ...rest } = book;
    return id ? this.#update(id, rest) : this.#create(rest);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.bookFormComponent()?.hasChanges()) {
      const dialogRef = this.#dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          text: UNSAVED_CHANGES_WARNING,
        },
      });

      return dialogRef.afterClosed().pipe(
        switchMap((result: boolean) => {
          if (result) {
            return this.bookFormComponent()
              ?.removeUploadedFiles()
              .pipe(map(() => true));
          }

          return of(false);
        })
      );
    }

    return true;
  }

  #create(book: BookFormModel) {
    this.loading.set(true);
    this.#booksService
      .create(book)
      .pipe(
        tap(() => {
          this.loading.set(false);
        })
      )
      .subscribe(({ data, errors }) => {
        if (data) {
          this.#feedbackService.success(BOOK_CREATED);
        }

        if (errors) {
          this.error.set(errors[errors.length - 1]);
        }
      });
  }

  #update(id: string, book: Partial<BookFormModel>) {
    this.loading.set(true);
    this.#booksService
      .update(id, book)
      .pipe(
        tap(() => {
          this.loading.set(false);
        })
      )
      .subscribe(({ data, errors }) => {
        if (data) {
          this.#feedbackService.success(BOOK_UPDATED);
        }

        if (errors) {
          this.error.set(errors[errors.length - 1]);
        }
      });
  }
}
