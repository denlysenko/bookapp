import { Component, OnInit } from '@angular/core';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import { BehaviorSubject } from 'rxjs';

import * as app from 'tns-core-modules/application';
import { getViewById } from 'tns-core-modules/ui/page/page';
import { SegmentedBarItem } from 'tns-core-modules/ui/segmented-bar';

@Component({
  selector: 'bookapp-browse-books-page',
  templateUrl: './browse-books-page.component.html',
  styleUrls: ['./browse-books-page.component.scss']
})
export class BrowseBooksPageComponent implements OnInit {
  sortOptions = [
    {
      value: '',
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

  private selectedOption = new BehaviorSubject<number>(0);

  constructor() {}

  get selectedOption$() {
    return this.selectedOption.asObservable();
  }

  ngOnInit() {}

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
    // this.skip = 0;

    // const { value } = this.sortOptions[this.selectedOption];
    // this.sortValue = value;
    // const { sortValue, skip, paid } = this;

    // this.storeService.set(FILTER_KEYS[paid ? 'BUY_BOOKS' : 'BROWSE_BOOKS'], {
    //   sortValue: value
    // });

    // this.bookQueryRef.refetch({
    //   skip,
    //   orderBy: sortValue
    // });

    // this.bookListView.scrollToIndex(0);
  }

  async onSearchButtonTap() {
    // const options: ModalDialogOptions = {
    //   context: { paid: this.paid },
    //   fullscreen: true,
    //   animated: false,
    //   viewContainerRef: this.viewContainerRef
    // };
    // const book = await this.modalService.showModal(
    //   BookSearchComponent,
    //   options
    // );
    // if (book) {
    //   // wait when modal close
    //   setTimeout(() => {
    //     this.routerExtensions.navigateByUrl(
    //       book.paid
    //         ? `/buy/${book.url}?bookId=${book.id}`
    //         : `/browse/${book.url}?bookId=${book.id}`
    //     );
    //   });
    // }
  }
}
