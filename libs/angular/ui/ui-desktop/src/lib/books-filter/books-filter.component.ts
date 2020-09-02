import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { BaseComponent } from '@bookapp/angular/base';
import { DEFAULT_SORT_VALUE } from '@bookapp/angular/data-access';
import { BooksFilter } from '@bookapp/shared/interfaces';

import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bookapp-books-filter',
  templateUrl: './books-filter.component.html',
  styleUrls: ['./books-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksFilterComponent extends BaseComponent implements OnInit {
  searchQuery = new FormControl(null);
  sortValue = DEFAULT_SORT_VALUE;

  @Input()
  set filter(filter: BooksFilter) {
    if (filter) {
      const { searchQuery, sortValue } = filter;

      if (searchQuery) {
        this.searchQuery.setValue(searchQuery, { emitEvent: false });
      }

      if (sortValue) {
        this.sortValue = sortValue;
      }
    }
  }

  @Output() sortChanged = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();

  ngOnInit() {
    this.searchQuery.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val) => this.searchChanged.emit(val));
  }

  sort(e: MatButtonToggleChange) {
    this.sortChanged.emit(e.value);
  }
}
