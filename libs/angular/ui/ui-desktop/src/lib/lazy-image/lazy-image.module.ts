import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyImageDirective } from './lazy-image.directive';

@NgModule({
  declarations: [LazyImageDirective],
  imports: [CommonModule],
  exports: [LazyImageDirective],
})
export class LazyImageModule {}
