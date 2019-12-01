import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryPageComponent } from './containers/history-page/history-page.component';
import { HistoryListComponent } from './components/history-list/history-list.component';
import { HistoryListItemComponent } from './components/history-list-item/history-list-item.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HistoryPageComponent, HistoryListComponent, HistoryListItemComponent]
})
export class HistoryModule {}
