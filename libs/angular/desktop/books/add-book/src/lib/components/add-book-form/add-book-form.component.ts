import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseForm } from '@bookapp/angular/base';
import { UploadPlatformService } from '@bookapp/angular/core';
import { FileSelectorComponent, ImageSelectorComponent } from '@bookapp/angular/ui-desktop';
import { ApiError, Book, BookFormModel } from '@bookapp/shared/interfaces';
import { extractFileKey } from '@bookapp/utils/api';

import { isEqual } from 'lodash-es';
import { forkJoin, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Form {
  readonly id: FormControl<string>;
  readonly title: FormControl<string>;
  readonly author: FormControl<string>;
  readonly description: FormControl<string>;
  readonly paid: FormControl<boolean>;
  readonly price: FormControl<number>;
  readonly coverUrl: FormControl<string>;
  readonly epubUrl: FormControl<string>;
}

@Component({
  selector: 'bookapp-add-book-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBookFormComponent extends BaseForm<Form> implements OnInit {
  readonly loading = input(false);
  readonly error = input<ApiError>();
  readonly book = input<Book>();

  readonly formSubmitted = output<BookFormModel>();

  readonly #fb = inject(FormBuilder);
  readonly #injector = inject(Injector);
  readonly #dialog = inject(MatDialog);
  readonly #uploadService = inject(UploadPlatformService);
  readonly #cdr = inject(ChangeDetectorRef);

  readonly form = this.#fb.group({
    id: [null],
    title: ['', Validators.required],
    author: ['', Validators.required],
    description: ['', Validators.required],
    paid: [false],
    price: [null as number | null, Validators.required],
    coverUrl: [null],
    epubUrl: [null],
  });

  #initialFormValue: FormGroup<Form>['value'];

  ngOnInit(): void {
    this.#togglePriceField(false);
    this.paidControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.#togglePriceField.bind(this));
    this.#initialFormValue = { ...this.form.value };

    effect(
      () => {
        const book = this.book();

        if (book) {
          this.form.patchValue(book);
          this.#initialFormValue = { ...this.form.value };
        }
      },
      { injector: this.#injector }
    );

    effect(
      () => {
        const error = this.error();

        if (error) {
          this.handleError(error);
        }
      },
      { injector: this.#injector }
    );
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
    const dialogRef = this.#dialog.open(ImageSelectorComponent, {
      width: '300px',
      data: { maintainAspectRatio: false },
    });

    dialogRef.afterClosed().subscribe((coverUrl) => {
      if (coverUrl) {
        this.form.patchValue({ coverUrl });
        this.#cdr.markForCheck();
      }
    });
  }

  showFileSelector() {
    const dialogRef = this.#dialog.open(FileSelectorComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((epubUrl) => {
      if (epubUrl) {
        this.form.patchValue({ epubUrl });
        this.#cdr.markForCheck();
      }
    });
  }

  submit() {
    if (this.form.valid) {
      const { value } = this.form;
      this.formSubmitted.emit(value as BookFormModel);
      this.#initialFormValue = { ...value };
    }
  }

  hasChanges() {
    return !isEqual(this.form.value, this.#initialFormValue);
  }

  removeUploadedFiles() {
    const observables = [];

    if (this.coverUrl !== this.#initialFormValue.coverUrl) {
      observables.push(this.#uploadService.deleteFile(extractFileKey(this.coverUrl)));
    }

    if (this.epubUrl !== this.#initialFormValue.epubUrl) {
      observables.push(this.#uploadService.deleteFile(extractFileKey(this.epubUrl)));
    }

    if (observables.length) {
      return forkJoin(observables);
    }

    return of(null);
  }

  #togglePriceField(paid: boolean) {
    if (paid) {
      this.priceControl.enable();
    } else {
      this.priceControl.disable();
    }
  }
}
