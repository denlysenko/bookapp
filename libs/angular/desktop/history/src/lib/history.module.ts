import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HistoryListComponent } from './components/history-list/history-list.component';
import { HistoryPageComponent } from './containers/history-page/history-page.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HistoryPageComponent, HistoryListComponent]
})
export class HistoryModule {}
