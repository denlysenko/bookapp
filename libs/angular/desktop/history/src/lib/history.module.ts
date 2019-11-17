import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PreloaderModule } from '@bookapp/angular/ui-desktop';

import { HistoryListComponent } from './components/history-list/history-list.component';
import { HistoryPageComponent } from './containers/history-page/history-page.component';
import { HistoryRoutingModule } from './history-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HistoryRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    PreloaderModule
  ],
  declarations: [HistoryPageComponent, HistoryListComponent]
})
export class HistoryModule {}
