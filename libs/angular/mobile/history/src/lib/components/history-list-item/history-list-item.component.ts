import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bookapp-history-list-item',
  templateUrl: './history-list-item.component.html',
  styleUrls: ['./history-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryListItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
