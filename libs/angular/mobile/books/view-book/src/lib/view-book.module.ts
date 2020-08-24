import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NgShadowModule } from 'nativescript-ngx-shadow';

import { BookCommentsComponent } from './components/book-comments/book-comments.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { ViewBookPageComponent } from './containers/view-book-page/view-book-page.component';
import { ViewBookRoutingModule } from './view-book-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    ViewBookRoutingModule,
    NgShadowModule,
  ],
  declarations: [ViewBookPageComponent, BookDetailsComponent, BookCommentsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ViewBookModule {}
