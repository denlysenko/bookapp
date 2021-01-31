import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PaymentRequestPlatformService } from '@bookapp/angular/core';
import { AuthService, BookmarksService, BookService } from '@bookapp/angular/data-access';
import { RatingModule } from '@bookapp/angular/ui-desktop';
import { BOOKMARKS } from '@bookapp/shared/enums';
import {
  book,
  MockAngularAuthService,
  MockAngularBookmarksService,
  MockAngularBookService,
  user,
} from '@bookapp/testing';

import { ViewBookPageComponent } from './view-book-page.component';

describe('ViewBookPageComponent', () => {
  let component: ViewBookPageComponent;
  let fixture: ComponentFixture<ViewBookPageComponent>;
  let bookService: BookService;
  let bookmarksService: BookmarksService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule, RatingModule, MatIconModule, RouterTestingModule],
        declarations: [ViewBookPageComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: {
                  get: jest.fn(() => book.slug),
                },
                queryParamMap: {
                  get: jest.fn(() => book._id),
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBookPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    bookService = fixture.debugElement.injector.get(BookService);
    bookmarksService = fixture.debugElement.injector.get(BookmarksService);
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
        bookId: book._id,
      });
      expect(bookmarksService.addToBookmarks).toHaveBeenCalled();
    });
  });

  describe('removeFromBookmarks()', () => {
    it('should call bookmarksService.removeFromBookmarks()', () => {
      component.removeFromBookmarks({
        type: BOOKMARKS.FAVORITES,
        bookId: book._id,
      });
      expect(bookmarksService.removeFromBookmarks).toHaveBeenCalled();
    });
  });
});
