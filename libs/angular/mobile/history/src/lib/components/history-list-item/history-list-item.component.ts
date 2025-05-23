import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, NO_ERRORS_SCHEMA } from '@angular/core';

import { UserActionsDesc } from '@bookapp/shared/enums';
import { Log } from '@bookapp/shared/interfaces';

import { NativeScriptCommonModule, NSRouterLink } from '@nativescript/angular';

@Component({
  selector: 'bookapp-history-list-item',
  imports: [NativeScriptCommonModule, NSRouterLink, DatePipe],
  templateUrl: './history-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class HistoryListItemComponent {
  readonly log = input<Log>();
  readonly actions = UserActionsDesc;
}
