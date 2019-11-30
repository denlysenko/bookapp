import { Component } from '@angular/core';

import { BestBooksBase } from '@bookapp/angular/base';
import { BooksService } from '@bookapp/angular/data-access';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import { getViewById } from 'tns-core-modules/ui/page/page';

@Component({
  moduleId: module.id,
  selector: 'bookapp-best-books-page',
  templateUrl: './best-books-page.component.html',
  styleUrls: ['./best-books-page.component.scss']
})
export class BestBooksPageComponent extends BestBooksBase {
  constructor(booksService: BooksService) {
    super(booksService);
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(app.getRootView(), 'drawer') as RadSideDrawer;
    sideDrawer.toggleDrawerState();
  }
}
