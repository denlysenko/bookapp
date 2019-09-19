import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { BaseForm } from '@bookapp/angular/base';
import {
  FeedbackPlatformService,
  UploadPlatformService
} from '@bookapp/angular/core';
import {
  FileSelectorComponent,
  ImageSelectorComponent
} from '@bookapp/angular/ui';
import { Book } from '@bookapp/shared';
import { extractFileKey } from '@bookapp/utils';

import { isEqual } from 'lodash';
import { forkJoin, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bookapp-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddBookFormComponent extends BaseForm {
  form = this.fb.group({
    _id: [null],
    title: [null, Validators.required],
    author: [null, Validators.required],
    description: [null, Validators.required],
    paid: [false],
    price: [null, Validators.required],
    coverUrl: [null],
    epubUrl: [null]
  });

  @Input() loading: boolean;

  @Input()
  set book(book: Book) {
    if (book) {
      this._book = book;
      this.form.patchValue(book);
      this.initialFormValue = { ...this.form.value };
    }
  }
  get book(): Book {
    return this._book;
  }

  @Input()
  set error(value: any) {
    if (value) {
      this.handleError(value);
    }
  }

  @Output() formSubmitted = new EventEmitter<Book>();

  private _book: Book;
  private initialFormValue: any = { ...this.form.value };

  constructor(
    feedbackService: FeedbackPlatformService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly uploadService: UploadPlatformService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(feedbackService);
    this.togglePriceField(false);
    this.paidControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.togglePriceField.bind(this));
  }

  get coverUrl(): string {
    return this.form.get('coverUrl').value;
  }

  get epubUrl(): string {
    return this.form.get('epubUrl').value;
  }

  get priceControl(): AbstractControl {
    return this.form.get('price');
  }

  get paidControl(): AbstractControl {
    return this.form.get('paid');
  }

  get isPaid(): boolean {
    return this.paidControl.value === true;
  }

  showCoverSelector() {
    const dialogRef = this.dialog.open(ImageSelectorComponent, {
      width: '300px',
      data: { maintainAspectRatio: false }
    });

    dialogRef.afterClosed().subscribe(coverUrl => {
      if (coverUrl) {
        this.form.patchValue({ coverUrl });
        this.cdr.markForCheck();
      }
    });
  }

  showFileSelector() {
    const dialogRef = this.dialog.open(FileSelectorComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(epubUrl => {
      if (epubUrl) {
        this.form.patchValue({ epubUrl });
        this.cdr.markForCheck();
      }
    });
  }

  submit() {
    if (this.form.valid) {
      const { value } = this.form;
      this.formSubmitted.emit(value);
      this.initialFormValue = { ...value };
    }
  }

  hasChanges() {
    return !isEqual(this.form.value, this.initialFormValue);
  }

  removeUploadedFiles() {
    const observables = [];

    if (this.coverUrl !== this.initialFormValue.coverUrl) {
      observables.push(
        this.uploadService.deleteFile(extractFileKey(this.coverUrl))
      );
    }

    if (this.epubUrl !== this.initialFormValue.epubUrl) {
      observables.push(
        this.uploadService.deleteFile(extractFileKey(this.epubUrl))
      );
    }

    if (observables.length) {
      return forkJoin(observables);
    }

    return of(null);
  }

  private togglePriceField(paid: boolean) {
    if (paid) {
      this.priceControl.enable();
    } else {
      this.priceControl.disable();
    }
  }
}
