import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import { Log } from '@bookapp/shared';

import { ListViewLoadOnDemandMode } from 'nativescript-ui-listview';
import { RadListViewComponent } from 'nativescript-ui-listview/angular/listview-directives';

import { BehaviorSubject } from 'rxjs';

import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { Color, isIOS } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'bookapp-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryListComponent {
  @Input()
  set logs(logs: Log[]) {
    if (logs) {
      this._logs.next(new ObservableArray(logs));
      this.listViewComponent.listView.notifyLoadOnDemandFinished();
    }
  }

  @Input()
  set hasMoreItems(hasMoreItems: boolean) {
    this.listViewComponent.listView.loadOnDemandMode =
      ListViewLoadOnDemandMode[hasMoreItems ? 'Auto' : 'None'];
  }

  @Output()
  loadMore = new EventEmitter<void>();

  @ViewChild('listView', { static: true })
  listViewComponent: RadListViewComponent;

  private _logs = new BehaviorSubject<ObservableArray<Log> | null>(null);

  get logs$() {
    return this._logs.asObservable();
  }

  onItemLoading(args: any) {
    if (isIOS) {
      const newcolor = new Color('#eeeeee');
      args.ios.backgroundView.backgroundColor = newcolor.ios;
    }
  }

  scrollToIndex(index: number) {
    this.listViewComponent.listView.scrollToIndex(index);
  }
}
