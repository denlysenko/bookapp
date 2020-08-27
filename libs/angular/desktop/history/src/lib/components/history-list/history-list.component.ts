import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { Log, Pagination, Sorting, UserActionsDesc } from '@bookapp/shared';

@Component({
  selector: 'bookapp-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryListComponent {
  readonly displayedColumns = ['createdAt', 'action', 'book'];
  readonly defaultLimit = DEFAULT_LIMIT;
  readonly actions = UserActionsDesc;

  @Input()
  sorting: Sorting;

  @Input()
  pagination: Pagination;

  @Input()
  logs: Log[];

  @Input()
  totalCount: number;

  @Output()
  sortChanged = new EventEmitter<Sort>();

  @Output()
  pageChanged = new EventEmitter<PageEvent>();
}
