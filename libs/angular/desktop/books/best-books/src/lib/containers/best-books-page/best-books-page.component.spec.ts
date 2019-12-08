import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { BooksService } from '@bookapp/angular/data-access';
import { book, MockAngularBooksService } from '@bookapp/testing';

import { of } from 'rxjs';

import { BestBooksModule } from '../../best-books.module';
import { BestBooksPageComponent } from './best-books-page.component';

describe('BestBooksPageComponent', () => {
  let component: BestBooksPageComponent;
  let fixture: ComponentFixture<BestBooksPageComponent>;
  let booksService: BooksService;

  beforeAll(() => {
    (window as any).IntersectionObserver = jest.fn(() => ({
      observe: () => null,
      disconnect: () => null
    }));
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, BestBooksModule],
      providers: [
        {
          provide: BooksService,
          useValue: MockAngularBooksService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestBooksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    booksService = TestBed.get(BooksService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('books$', () => {
    it('should have books', done => {
      component.books$.subscribe(books => {
        expect(books).toEqual([book]);
        done();
      });
    });
  });

  describe('loadMore()', () => {
    it('should not fetchMore if there are no items', () => {
      component.loadMore();
      expect(component.booksQueryRef.fetchMore).not.toHaveBeenCalled();
    });

    it('should fetchMore books', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, RouterTestingModule, BestBooksModule],
        providers: [
          {
            provide: BooksService,
            useValue: {
              ...MockAngularBooksService,
              getBestBooks: jest.fn().mockImplementationOnce(() => ({
                valueChanges: of({
                  data: { bestBooks: { rows: [book], count: 3 } }
                }),
                refetch: jest.fn(),
                fetchMore: jest.fn()
              }))
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(BestBooksPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.loadMore();
      expect(component.booksQueryRef.fetchMore).toHaveBeenCalled();
    });
  });

  describe('rate()', () => {
    it('should rate book', () => {
      component.rate({ bookId: book._id, rate: 5 });
      expect(booksService.rateBook).toHaveBeenCalled();
    });
  });
});
