import { Component, ViewChild } from '@angular/core';

import { HistoryPageBase } from '@bookapp/angular/base';
import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { LogsService } from '@bookapp/angular/data-access';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import { action } from 'tns-core-modules/ui/dialogs';
import { getViewById } from 'tns-core-modules/ui/page/page';

import { HistoryListComponent } from '../../components/history-list/history-list.component';

@Component({
  selector: 'bookapp-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent extends HistoryPageBase {
  @ViewChild(HistoryListComponent, { static: false })
  historyListView: HistoryListComponent;

  private skip = 0;

  constructor(logsService: LogsService) {
    super(logsService);
  }

  get hasMoreItems$() {
    return this.hasMoreItems.asObservable();
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(app.getRootView(), 'drawer') as RadSideDrawer;
    sideDrawer.toggleDrawerState();
  }

  async onFilterTap() {
    const result = await action({
      message: 'Sort By Creation Date',
      cancelButtonText: 'Cancel',
      actions: ['Ascending', 'Descending']
    });

    if (result === 'Ascending') {
      return this.sort('asc');
    }

    if (result === 'Descending') {
      return this.sort('desc');
    }
  }

  loadMore() {
    if (this.pending) {
      return;
    }

    if (this.hasMoreItems.getValue()) {
      this.skip += DEFAULT_LIMIT;

      this.logsQueryRef.fetchMore({
        variables: {
          skip: this.skip
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          const { rows, count } = fetchMoreResult.logs;

          return {
            logs: {
              count,
              rows: [...previousResult.logs.rows, ...rows],
              __typename: 'LogsResponse'
            }
          };
        }
      });
    }
  }

  private sort(direction: string) {
    this.skip = 0;
    this.logsQueryRef.refetch({
      skip: this.skip,
      orderBy: `createdAt_${direction}`
    });
    // this.historyListView.scrollToIndex(0);
  }
}
