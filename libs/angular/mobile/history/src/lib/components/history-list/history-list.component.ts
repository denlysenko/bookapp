/* eslint-disable no-unused-private-class-members */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  NO_ERRORS_SCHEMA,
  output,
  viewChild,
} from '@angular/core';

import { Log } from '@bookapp/shared/interfaces';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { ObservableArray } from '@nativescript/core';

import { ListViewLoadOnDemandMode } from 'nativescript-ui-listview';
import {
  NativeScriptUIListViewModule,
  RadListViewComponent,
} from 'nativescript-ui-listview/angular';

import { HistoryListItemComponent } from '../history-list-item/history-list-item.component';

@Component({
  selector: 'bookapp-history-list',
  imports: [NativeScriptCommonModule, NativeScriptUIListViewModule, HistoryListItemComponent],
  templateUrl: './history-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class HistoryListComponent {
  readonly logs = input<Log[]>();
  readonly hasMoreItems = input<boolean>();

  readonly loadMore = output<void>();

  readonly #logsEffect = effect(() => {
    const logs = this.logs();

    if (!logs) {
      return;
    }

    try {
      this.listViewComponent()?.listView.notifyLoadOnDemandFinished();
    } catch {
      //
    }
  });

  readonly #hasMoreItemsEffect = effect(() => {
    const hasMoreItems = this.hasMoreItems();

    if (this.listViewComponent()) {
      this.listViewComponent().listView.loadOnDemandMode =
        ListViewLoadOnDemandMode[hasMoreItems ? 'Auto' : 'None'];
    }
  });

  readonly listViewComponent = viewChild<RadListViewComponent>('listView');

  readonly _logs = computed(() => {
    const logs = this.logs();

    if (!logs) {
      return null;
    }

    return new ObservableArray(logs);
  });

  scrollToIndex(index: number) {
    this.listViewComponent()?.listView.scrollToIndex(index);
  }
}
