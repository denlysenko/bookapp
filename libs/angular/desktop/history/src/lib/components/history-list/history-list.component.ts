import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { UserActionsDesc } from '@bookapp/shared/enums';
import { Log, Pagination, Sorting } from '@bookapp/shared/interfaces';

@Component({
  selector: 'bookapp-history-list',
  imports: [RouterLink, MatCardModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe],
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryListComponent {
  readonly sorting = input<Sorting>();
  readonly pagination = input<Pagination>();
  readonly logs = input<Log[]>();
  readonly totalCount = input<number>();

  readonly sortChanged = output<Sort>();
  readonly pageChanged = output<PageEvent>();

  readonly displayedColumns = ['createdAt', 'action', 'book'];
  readonly defaultLimit = DEFAULT_LIMIT;
  readonly actions = UserActionsDesc;
}
