import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StoreService } from '@bookapp/angular/core';
import { BooksService, DEFAULT_SORT_VALUE } from '@bookapp/angular/data-access';
import { book, MockAngularBooksService, MockStoreService } from '@bookapp/testing/angular';

import { of } from 'rxjs';

import { BrowseBooksPageComponent } from './browse-books-page.component';

describe('BrowseBooksPageComponent', () => {
  let component: BrowseBooksPageComponent;
  let fixture: ComponentFixture<BrowseBooksPageComponent>;
  let storeService: StoreService;
  let booksService: BooksService;

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).IntersectionObserver = jest.fn(() => ({
      observe: () => null,
      disconnect: () => null,
    }));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowseBooksPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: StoreService,
          useValue: MockStoreService,
        },
      ],
    })
      .overrideComponent(BrowseBooksPageComponent, {
        set: {
          providers: [
            {
              provide: BooksService,
              useValue: MockAngularBooksService,
            },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseBooksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    storeService = TestBed.inject(StoreService);
    booksService = fixture.componentRef.injector.get(BooksService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filter', () => {
    it('should have default filter', () => {
      expect(component.filter()).toMatchObject({
        searchQuery: '',
        sortValue: DEFAULT_SORT_VALUE,
      });
    });

    it('should have filter from store', () => {
      const filterInStore = {
        searchQuery: 'test',
        sortValue: 'createdAt_desc',
      };

      jest.spyOn(storeService, 'get').mockReturnValueOnce(filterInStore);

      fixture = TestBed.createComponent(BrowseBooksPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.filter()).toMatchObject(filterInStore);
    });
  });

  describe('books$', () => {
    it('should have books', (done) => {
      component.books$.subscribe((books) => {
        expect(books).toEqual([book]);
        done();
      });
    });
  });

  describe('sort()', () => {
    beforeEach(() => {
      component.sort('title_asc');
    });

    it('should update filter$', () => {
      expect(component.filter()).toMatchObject({
        sortValue: 'title_asc',
      });
    });

    it('should update filter in store', () => {
      expect(storeService.set).toHaveBeenCalledWith('BROWSE_BOOKS', {
        searchQuery: '',
        sortValue: 'title_asc',
      });
    });

    it('should refetch books', () => {
      expect(booksService.refetch).toHaveBeenCalledWith({
        orderBy: 'title_asc',
        skip: 0,
      });
    });
  });

  describe('search()', () => {
    beforeEach(() => {
      component.search('title');
    });

    it('should update filter', () => {
      expect(component.filter()).toMatchObject({
        sortValue: DEFAULT_SORT_VALUE,
        searchQuery: 'title',
      });
    });

    it('should update filter in store', () => {
      expect(storeService.set).toHaveBeenCalledWith('BROWSE_BOOKS', {
        searchQuery: 'title',
        sortValue: DEFAULT_SORT_VALUE,
      });
    });

    it('should refetch books', () => {
      expect(booksService.refetch).toHaveBeenCalledWith({
        filter: { field: 'title', search: 'title' },
        skip: 0,
      });
    });
  });

  describe('loadMore()', () => {
    it('should not fetchMore if there are no items', () => {
      component.loadMore();
      expect(booksService.loadMore).not.toHaveBeenCalled();
    });

    it('should fetchMore books', () => {
      jest.spyOn(booksService, 'watchBooks').mockImplementationOnce(() =>
        of({
          data: { books: { rows: [book], count: 3 } },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      );

      fixture = TestBed.createComponent(BrowseBooksPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.loadMore();
      expect(booksService.loadMore).toHaveBeenCalledWith(10);
    });
  });

  describe('rate()', () => {
    it('should rate book', fakeAsync(() => {
      const event = { bookId: book.id, rate: 5 };
      component.rate(event);
      tick();
      expect(booksService.rateBook).toHaveBeenCalledWith(event);
    }));
  });
});
