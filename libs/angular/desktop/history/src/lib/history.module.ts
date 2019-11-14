import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { HistoryListComponent } from './components/history-list/history-list.component';
import { HistoryPageComponent } from './containers/history-page/history-page.component';
import { HistoryRoutingModule } from './history-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HistoryRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  declarations: [HistoryPageComponent, HistoryListComponent]
})
export class HistoryModule {}
