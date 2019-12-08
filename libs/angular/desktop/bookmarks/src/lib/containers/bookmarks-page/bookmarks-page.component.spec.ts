import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BookmarksService, BooksService } from '@bookapp/angular/data-access';
import { BOOKMARKS } from '@bookapp/shared';
import {
  book,
  bookmark,
  MockAngularBookmarksService,
  MockAngularBooksService
} from '@bookapp/testing';

import { of } from 'rxjs';

import { BookmarksModule } from '../../bookmarks.module';
import { BookmarksPageComponent } from './bookmarks-page.component';

const title = 'Favorite Books';

describe('BookmarksPageComponent', () => {
  let component: BookmarksPageComponent;
  let fixture: ComponentFixture<BookmarksPageComponent>;
  let booksService: BooksService;

  beforeAll(() => {
    (window as any).IntersectionObserver = jest.fn(() => ({
      observe: () => null,
      disconnect: () => null
    }));
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, BookmarksModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                type: BOOKMARKS.FAVORITES
              }
            },
            data: of({
              title
            })
          }
        },
        {
          provide: BooksService,
          useValue: MockAngularBooksService
        },
        {
          provide: BookmarksService,
          useValue: MockAngularBookmarksService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksPageComponent);
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
        expect(books).toEqual([bookmark.book]);
        done();
      });
    });
  });

  describe('loadMore()', () => {
    it('should not fetchMore if there are no items', () => {
      component.loadMore();
      expect(component.bookmarksQueryRef.fetchMore).not.toHaveBeenCalled();
    });

    it('should fetchMore books', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, RouterTestingModule, BookmarksModule],
        providers: [
          {
            provide: BooksService,
            useValue: MockAngularBooksService
          },
          {
            provide: BookmarksService,
            useValue: {
              ...MockAngularBookmarksService,
              getBookmarksByType: jest.fn().mockImplementationOnce(() => ({
                valueChanges: of({
                  data: { bookmarks: { rows: [bookmark], count: 3 } }
                }),
                refetch: jest.fn(),
                fetchMore: jest.fn()
              }))
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(BookmarksPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.loadMore();
      expect(component.bookmarksQueryRef.fetchMore).toHaveBeenCalled();
    });
  });

  describe('rate()', () => {
    it('should rate book', () => {
      component.rate({ bookId: book._id, rate: 5 });
      expect(booksService.rateBook).toHaveBeenCalled();
    });
  });
});
