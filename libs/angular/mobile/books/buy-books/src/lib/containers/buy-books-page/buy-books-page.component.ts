import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { BooksPageBase } from '@bookapp/angular/base';
import { RouterExtensions, StoreService } from '@bookapp/angular/core';
import { BooksService } from '@bookapp/angular/data-access';
import {
  BookSearchComponent,
  BooksListComponent
} from '@bookapp/angular/ui-mobile';
import { Book, BooksFilter } from '@bookapp/shared';

import {
  ModalDialogOptions,
  ModalDialogService
} from 'nativescript-angular/modal-dialog';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import { BehaviorSubject } from 'rxjs';

import * as app from 'tns-core-modules/application';
import { getViewById } from 'tns-core-modules/ui/page/page';
import { SegmentedBarItem } from 'tns-core-modules/ui/segmented-bar';

interface SortOption {
  value: BooksFilter['sortValue'];
  label: string;
}

/* TODO: move common of this class and browse books class logic to the base class. didn't do during the development because jest could not transform Nativescript files, and threw errors */
@Component({
  moduleId: module.id,
  selector: 'bookapp-buy-books-page',
  templateUrl: './buy-books-page.component.html',
  styleUrls: ['./buy-books-page.component.scss']
})
export class BuyBooksPageComponent extends BooksPageBase {
  sortOptions: SortOption[] = [
    {
      value: 'rating_desc',
      label: 'All books'
    },
    {
      value: 'createdAt_desc',
      label: 'Most recent'
    },
    {
      value: 'views_desc',
      label: 'Most popular'
    }
  ];

  sortItems: SegmentedBarItem[] = this.sortOptions.map(option => {
    const item = new SegmentedBarItem();
    item.title = option.label;
    return item;
  });

  @ViewChild(BooksListComponent, { static: true })
  booksList: BooksListComponent;

  private selectedOption = new BehaviorSubject<number>(0);

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly modalService: ModalDialogService,
    private readonly routerExtensions: RouterExtensions,
    storeService: StoreService,
    booksService: BooksService
  ) {
    super(storeService, booksService, true);
    this.setInitialSorting();
  }

  get selectedOption$() {
    return this.selectedOption.asObservable();
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(
      app.getRootView(),
      'drawer'
    ) as RadSideDrawer;
    sideDrawer.toggleDrawerState();
  }

  onSelectedIndexChange(args: any) {
    const selectedIndex = args.object.selectedIndex;
    this.selectedOption.next(selectedIndex);

    const { value } = this.sortOptions[selectedIndex];

    super.sort(value);
    this.booksList.scrollToIndex(0);
  }

  async onSearchButtonTap() {
    const options: ModalDialogOptions = {
      context: { paid: false },
      fullscreen: true,
      animated: false,
      viewContainerRef: this.viewContainerRef
    };

    const book: Book = await this.modalService.showModal(
      BookSearchComponent,
      options
    );

    if (book) {
      // wait when modal close
      setTimeout(() => {
        this.routerExtensions.navigateByUrl(
          book.paid
            ? `/buy/${book.url}?bookId=${book._id}`
            : `/browse/${book.url}?bookId=${book._id}`
        );
      });
    }
  }

  private setInitialSorting() {
    const filter = this.filter.getValue();

    if (filter) {
      const { sortValue } = filter;
      const index = this.sortOptions.findIndex(
        option => option.value === sortValue
      );
      this.selectedOption.next(index !== -1 ? index : 0);
    }
  }
}
