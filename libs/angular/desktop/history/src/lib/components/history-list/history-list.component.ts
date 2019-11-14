import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'bookapp-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
