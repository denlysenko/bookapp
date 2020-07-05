import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { BooksService } from '@bookapp/angular/data-access';
import { ConfirmDialogComponent } from '@bookapp/angular/ui-desktop';
import { Book, BookFormModel } from '@bookapp/shared';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { pluck, switchMap, switchMapTo, tap } from 'rxjs/operators';

import { AddBookFormComponent } from '../../components/add-book-form/add-book-form.component';

const BOOK_CREATED = 'Book created!';
const BOOK_UPDATED = 'Book updated!';
const UNSAVED_CHANGES_WARNING =
  'There are unsaved changes on the page. Are you sure you want to leave?';

@Component({
  selector: 'bookapp-add-book-page',
  templateUrl: './add-book-page.component.html',
  styleUrls: ['./add-book-page.component.scss']
})
export class AddBookPageComponent {
  book$: Observable<Book> = this.route.data.pipe(pluck('book'));

  @ViewChild(AddBookFormComponent)
  private readonly bookFormComponent: AddBookFormComponent;

  private loading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<any | null>(null);

  constructor(
    protected feedbackService: FeedbackPlatformService,
    private readonly dialog: MatDialog,
    private readonly booksService: BooksService,
    private readonly route: ActivatedRoute
  ) {}

  get loading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  get error$(): Observable<any | null> {
    return this.error.asObservable();
  }

  save(book: BookFormModel) {
    const { _id, ...rest } = book;
    return _id ? this.update(_id, rest) : this.create(rest);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.bookFormComponent.hasChanges()) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          text: UNSAVED_CHANGES_WARNING
        }
      });

      return dialogRef.afterClosed().pipe(
        switchMap((result: boolean) => {
          if (result) {
            return this.bookFormComponent.removeUploadedFiles().pipe(switchMapTo(of(true)));
          }

          return of(false);
        })
      );
    }

    return true;
  }

  private create(book: BookFormModel) {
    this.loading.next(true);
    this.booksService
      .create(book)
      .pipe(
        tap(() => {
          this.loading.next(false);
        })
      )
      .subscribe(({ data, errors }) => {
        if (data) {
          this.feedbackService.success(BOOK_CREATED);
        }

        if (errors) {
          this.error.next(errors[errors.length - 1]);
        }
      });
  }

  private update(id: string, book: Partial<BookFormModel>) {
    this.loading.next(true);
    this.booksService
      .update(id, book)
      .pipe(
        tap(() => {
          this.loading.next(false);
        })
      )
      .subscribe(({ data, errors }) => {
        if (data) {
          this.feedbackService.success(BOOK_UPDATED);
        }

        if (errors) {
          this.error.next(errors[errors.length - 1]);
        }
      });
  }
}
