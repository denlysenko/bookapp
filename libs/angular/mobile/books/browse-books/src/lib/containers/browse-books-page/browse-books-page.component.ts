import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NO_ERRORS_SCHEMA,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

import { BrowseBooksPageBase } from '@bookapp/angular/base';
import { LoaderPlatformService, RouterExtensions } from '@bookapp/angular/core';
import { BooksService } from '@bookapp/angular/data-access';
import { BookSearchComponent, BooksListComponent } from '@bookapp/angular/ui-mobile';
import { Book, BooksFilter } from '@bookapp/shared/interfaces';

import { Drawer } from '@nativescript-community/ui-drawer';

import {
  ModalDialogOptions,
  ModalDialogService,
  NativeScriptCommonModule,
} from '@nativescript/angular';
import { Application, getViewById, SegmentedBarItem } from '@nativescript/core';

import { takeUntil } from 'rxjs/operators';

interface SortOption {
  value: BooksFilter['sortValue'];
  label: string;
}

@Component({
  imports: [NativeScriptCommonModule, AsyncPipe, BooksListComponent],
  templateUrl: './browse-books-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BooksService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BrowseBooksPageComponent extends BrowseBooksPageBase implements OnInit {
  readonly booksList = viewChild(BooksListComponent);

  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #modalService = inject(ModalDialogService);
  readonly #routerExtensions = inject(RouterExtensions);
  readonly #loaderService = inject(LoaderPlatformService);

  readonly sortOptions: SortOption[] = [
    {
      value: 'rating_desc',
      label: 'All books',
    },
    {
      value: 'createdAt_desc',
      label: 'Most recent',
    },
    {
      value: 'views_desc',
      label: 'Most popular',
    },
  ];

  readonly sortItems: SegmentedBarItem[] = this.sortOptions.map((option) => {
    const item = new SegmentedBarItem();
    item.title = option.label;
    return item;
  });

  readonly selectedOption = signal(0);

  ngOnInit() {
    this.#setInitialSorting();
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.#loaderService.start() : this.#loaderService.stop()));
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(Application.getRootView(), 'drawer') as Drawer;
    sideDrawer.toggle();
  }

  onSelectedIndexChange(args: { object: { selectedIndex: number } }) {
    const selectedIndex = args.object.selectedIndex;
    this.selectedOption.set(selectedIndex);

    const { value } = this.sortOptions[selectedIndex];

    super.sort(value);
    this.booksList()?.scrollToIndex(0);
  }

  async onSearchButtonTap() {
    const options: ModalDialogOptions = {
      context: { paid: false },
      fullscreen: true,
      animated: true,
      viewContainerRef: this.#viewContainerRef,
      ios: {
        presentationStyle: 6, // UIModalPresentationOverCurrentContext
      },
    };

    const book: Book = await this.#modalService.showModal(BookSearchComponent, options);

    if (book) {
      // wait when modal close
      setTimeout(() => {
        this.#routerExtensions.navigateByUrl(
          book.paid
            ? `/books/buy/${book.url}?bookId=${book.id}`
            : `/books/browse/${book.url}?bookId=${book.id}`
        );
      }, 0);
    }
  }

  #setInitialSorting() {
    const filter = this.filter();

    if (filter) {
      const { sortValue } = filter;
      const index = this.sortOptions.findIndex((option) => option.value === sortValue);
      this.selectedOption.set(index !== -1 ? index : 0);
    }
  }
}
