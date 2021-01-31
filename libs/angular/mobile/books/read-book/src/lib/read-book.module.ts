import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule } from '@nativescript/angular';

import { ReadBookPageComponent } from './containers/read-book-page/read-book-page.component';
import { ReadBookRoutingModule } from './read-book-routing.module';

@NgModule({
  imports: [CommonModule, NativeScriptCommonModule, ReadBookRoutingModule],
  declarations: [ReadBookPageComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ReadBookModule {}
