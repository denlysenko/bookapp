import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { PaymentRequestPlatformService } from '@bookapp/angular/core';
import { AuthService, BookmarksService, BookService } from '@bookapp/angular/data-access';
import { BOOKMARKS } from '@bookapp/shared/enums';
import {
  book,
  MockAngularAuthService,
  MockAngularBookmarksService,
  MockAngularBookService,
  user,
} from '@bookapp/testing/angular';

import { ViewBookPageComponent } from './view-book-page.component';

describe('ViewBookPageComponent', () => {
  let component: ViewBookPageComponent;
  let fixture: ComponentFixture<ViewBookPageComponent>;
  let bookService: BookService;
  let bookmarksService: BookmarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewBookPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn(() => book.slug),
              },
              queryParamMap: {
                get: jest.fn(() => book.id),
              },
            },
          },
        },
        {
          provide: AuthService,
          useValue: MockAngularAuthService,
        },
        {
          provide: PaymentRequestPlatformService,
          useValue: {
            request: jest.fn().mockResolvedValue({ complete: jest.fn }),
          },
        },
      ],
    })
      .overrideComponent(ViewBookPageComponent, {
        set: {
          providers: [
            {
              provide: BookService,
              useValue: MockAngularBookService,
            },
            {
              provide: BookmarksService,
              useValue: MockAngularBookmarksService,
            },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBookPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    bookService = fixture.componentRef.injector.get(BookService);
    bookmarksService = fixture.componentRef.injector.get(BookmarksService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have book$', (done) => {
    component.book$.subscribe((res) => {
      expect(res).toEqual(book);
      done();
    });
  });

  it('should have bookmarks$', (done) => {
    component.bookmarks$.subscribe((res) => {
      expect(res).toEqual([BOOKMARKS.FAVORITES]);
      done();
    });
  });

  it('should have user$', (done) => {
    component.user$.subscribe((res) => {
      expect(res).toEqual(user);
      done();
    });
  });

  describe('submitComment()', () => {
    it('should call addComment()', fakeAsync(() => {
      component.submitComment('bookId', 'text');
      tick();
      expect(bookService.addComment).toHaveBeenCalledWith('bookId', 'text');
    }));
  });

  describe('rate()', () => {
    it('should call bookService.rate()', fakeAsync(() => {
      const event = { bookId: 'bookId', rate: 5 };
      component.rate(event);
      tick();
      expect(bookService.rateBook).toHaveBeenCalledWith(event);
    }));
  });

  describe('addToBookmarks()', () => {
    it('should call bookmarksService.addToBookmarks()', () => {
      component.addToBookmarks({
        type: BOOKMARKS.FAVORITES,
        bookId: book.id,
      });
      expect(bookmarksService.addToBookmarks).toHaveBeenCalled();
    });
  });

  describe('removeFromBookmarks()', () => {
    it('should call bookmarksService.removeFromBookmarks()', () => {
      component.removeFromBookmarks({
        type: BOOKMARKS.FAVORITES,
        bookId: book.id,
      });
      expect(bookmarksService.removeFromBookmarks).toHaveBeenCalled();
    });
  });
});
