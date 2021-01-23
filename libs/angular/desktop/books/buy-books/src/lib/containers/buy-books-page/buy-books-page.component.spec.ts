import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreService } from '@bookapp/angular/core';
import { BooksService, DEFAULT_SORT_VALUE } from '@bookapp/angular/data-access';
import { book, MockAngularBooksService, MockStoreService } from '@bookapp/testing';

import { of } from 'rxjs';

import { BuyBooksModule } from '../../buy-books.module';
import { BuyBooksPageComponent } from './buy-books-page.component';

describe('BuyBooksPageComponent', () => {
  let component: BuyBooksPageComponent;
  let fixture: ComponentFixture<BuyBooksPageComponent>;
  let storeService: StoreService;
  let booksService: BooksService;

  beforeAll(() => {
    (window as any).IntersectionObserver = jest.fn(() => ({
      observe: () => null,
      disconnect: () => null,
    }));
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, RouterTestingModule, BuyBooksModule],
        providers: [
          {
            provide: StoreService,
            useValue: MockStoreService,
          },
        ],
      })
        .overrideComponent(BuyBooksPageComponent, {
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyBooksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    storeService = TestBed.inject(StoreService);
    booksService = fixture.debugElement.injector.get(BooksService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filter$', () => {
    it('should have default filter', (done) => {
      component.filter$.subscribe((filter) => {
        expect(filter).toMatchObject({
          searchQuery: '',
          sortValue: DEFAULT_SORT_VALUE,
        });
        done();
      });
    });

    it('should have filter from store', (done) => {
      const filterInStore = {
        searchQuery: 'test',
        sortValue: 'createdAt_desc',
      };

      jest.spyOn(storeService, 'get').mockReturnValueOnce(filterInStore);

      fixture = TestBed.createComponent(BuyBooksPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.filter$.subscribe((filter) => {
        expect(filter).toMatchObject(filterInStore);
        done();
      });
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

    it('should update filter$', (done) => {
      component.filter$.subscribe((filter) => {
        expect(filter).toMatchObject({
          sortValue: 'title_asc',
        });
        done();
      });
    });

    it('should update filter in store', () => {
      expect(storeService.set).toHaveBeenCalledWith('BUY_BOOKS', {
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

    it('should update filter$', (done) => {
      component.filter$.subscribe((filter) => {
        expect(filter).toMatchObject({
          sortValue: DEFAULT_SORT_VALUE,
          searchQuery: 'title',
        });
        done();
      });
    });

    it('should update filter in store', () => {
      expect(storeService.set).toHaveBeenCalledWith('BUY_BOOKS', {
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
        } as any)
      );

      fixture = TestBed.createComponent(BuyBooksPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.loadMore();
      expect(booksService.loadMore).toHaveBeenCalledWith(10);
    });
  });

  describe('rate()', () => {
    it('should rate book', fakeAsync(() => {
      const event = { bookId: book._id, rate: 5 };
      component.rate(event);
      tick();
      expect(booksService.rateBook).toHaveBeenCalledWith(event);
    }));
  });
});
