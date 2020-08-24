import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DropDirective } from './drop.directive';

@NgModule({
  declarations: [DropDirective],
  imports: [CommonModule],
  exports: [DropDirective],
})
export class DropModule {}
