import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { BaseComponent } from '@bookapp/angular/base';
import { DEFAULT_SORT_VALUE } from '@bookapp/angular/data-access';
import { BooksFilter } from '@bookapp/shared/interfaces';

import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bookapp-books-filter',
  imports: [
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './books-filter.component.html',
  styleUrls: ['./books-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksFilterComponent extends BaseComponent implements OnInit {
  readonly filter = input<BooksFilter>();

  readonly sortChanged = output<BooksFilter['sortValue']>();
  readonly searchChanged = output<string>();

  readonly #injector = inject(Injector);

  readonly searchQuery = new FormControl<string>(null);
  sortValue = DEFAULT_SORT_VALUE;

  ngOnInit() {
    this.searchQuery.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val) => this.searchChanged.emit(val));

    effect(
      () => {
        const filter = this.filter();

        if (filter) {
          const { searchQuery, sortValue } = filter;

          if (searchQuery) {
            this.searchQuery.setValue(searchQuery, { emitEvent: false });
          }

          if (sortValue) {
            this.sortValue = sortValue;
          }
        }
      },
      { injector: this.#injector }
    );
  }

  sort(e: MatButtonToggleChange) {
    this.sortChanged.emit(e.value);
  }
}
