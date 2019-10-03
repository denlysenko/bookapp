import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { BookSearchComponent } from './book-search.component';

@NgModule({
  imports: [NativeScriptCommonModule, CommonModule],
  declarations: [BookSearchComponent],
  exports: [BookSearchComponent],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [BookSearchComponent]
})
export class BookSearchModule {}
