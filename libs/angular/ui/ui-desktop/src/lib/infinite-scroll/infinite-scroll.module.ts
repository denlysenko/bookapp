import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InfiniteScrollComponent } from './infinite-scroll.component';

@NgModule({
  declarations: [InfiniteScrollComponent],
  imports: [CommonModule],
  exports: [InfiniteScrollComponent]
})
export class InfiniteScrollModule {}
