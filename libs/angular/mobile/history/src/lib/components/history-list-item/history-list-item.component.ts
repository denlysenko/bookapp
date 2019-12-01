import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Log, UserActionsDesc } from '@bookapp/shared';

@Component({
  selector: 'bookapp-history-list-item',
  templateUrl: './history-list-item.component.html',
  styleUrls: ['./history-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryListItemComponent {
  readonly actions = UserActionsDesc;

  @Input()
  log: Log;
}
