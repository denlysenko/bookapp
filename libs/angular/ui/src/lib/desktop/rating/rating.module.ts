import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RatingComponent } from './rating.component';

@NgModule({
  declarations: [RatingComponent],
  imports: [CommonModule],
  exports: [RatingComponent]
})
export class RatingModule {}
