import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BestBooksService } from '@bookapp/angular/data-access';
import { book, MockAngularBestBooksService } from '@bookapp/testing/angular';

import { of } from 'rxjs';

import { BestBooksPageComponent } from './best-books-page.component';

describe('BestBooksPageComponent', () => {
  let component: BestBooksPageComponent;
  let fixture: ComponentFixture<BestBooksPageComponent>;
  let booksService: BestBooksService;

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).IntersectionObserver = jest.fn(() => ({
      observe: () => null,
      disconnect: () => null,
    }));
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BestBooksPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: BestBooksService,
          useValue: MockAngularBestBooksService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestBooksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    booksService = fixture.debugElement.injector.get(BestBooksService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('books$', () => {
    it('should have books', (done) => {
      component.books$.subscribe((books) => {
        expect(books).toEqual([book]);
        done();
      });
    });
  });

  describe('loadMore()', () => {
    it('should not loadMore if there are no items', () => {
      component.loadMore();
      expect(booksService.loadMore).not.toHaveBeenCalled();
    });

    it('should loadMore books', () => {
      jest.spyOn(booksService, 'watchBooks').mockImplementationOnce(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        of({ data: { bestBooks: { rows: [book], count: 2 } } } as any)
      );

      fixture = TestBed.createComponent(BestBooksPageComponent);
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
      expect(booksService.rateBook).toHaveBeenCalled();
    }));
  });
});
