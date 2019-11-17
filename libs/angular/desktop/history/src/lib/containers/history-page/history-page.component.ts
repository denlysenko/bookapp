import { Component } from '@angular/core';
import { HistoryPageBase } from '@bookapp/angular/base';
import { LogsService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent extends HistoryPageBase {
  constructor(logsService: LogsService) {
    super(logsService);
  }
}
