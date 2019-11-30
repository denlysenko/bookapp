import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService, BookmarksService, BooksService } from '@bookapp/angular/data-access';
import { RatingModule } from '@bookapp/angular/ui-desktop';
import { BOOKMARKS } from '@bookapp/shared';
import {
  book,
  MockAngularAuthService,
  MockAngularBookmarksService,
  MockAngularBooksService,
  user
} from '@bookapp/testing';

import { ViewBookPageComponent } from './view-book-page.component';

describe('ViewBookPageComponent', () => {
  let component: ViewBookPageComponent;
  let fixture: ComponentFixture<ViewBookPageComponent>;
  let booksService: BooksService;
  let bookmarksService: BookmarksService;

  beforeEach(async(() => {
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
                get: jest.fn(() => book.slug)
              },
              queryParamMap: {
                get: jest.fn(() => book._id)
              }
            }
          }
        },
        {
          provide: BooksService,
          useValue: MockAngularBooksService
        },
        {
          provide: BookmarksService,
          useValue: MockAngularBookmarksService
        },
        {
          provide: AuthService,
          useValue: MockAngularAuthService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBookPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    booksService = TestBed.get(BooksService);
    bookmarksService = TestBed.get(BookmarksService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have book$', done => {
    component.book$.subscribe(res => {
      expect(res).toEqual(book);
      done();
    });
  });

  it('should have bookmarks$', done => {
    component.bookmarks$.subscribe(res => {
      expect(res).toEqual([BOOKMARKS.FAVORITES]);
      done();
    });
  });

  it('should have user$', done => {
    component.user$.subscribe(res => {
      expect(res).toEqual(user);
      done();
    });
  });

  describe('submitComment()', () => {
    it('should call booksService.addComment()', () => {
      component.submitComment('bookId', 'text', 'slug');
      expect(booksService.addComment).toHaveBeenCalled();
    });
  });

  describe('rate()', () => {
    it('should call booksService.rate()', () => {
      component.rate({ bookId: 'bookId', rate: 5 }, 'slug');
      expect(booksService.rateBook).toHaveBeenCalled();
    });
  });

  describe('addToBookmarks()', () => {
    it('should call bookmarksService.addToBookmarks()', () => {
      component.addToBookmarks({
        type: BOOKMARKS.FAVORITES,
        bookId: book._id
      });
      expect(bookmarksService.addToBookmarks).toHaveBeenCalled();
    });
  });
  describe('removeFromBookmarks()', () => {
    it('should call bookmarksService.removeFromBookmarks()', () => {
      component.removeFromBookmarks({
        type: BOOKMARKS.FAVORITES,
        bookId: book._id
      });
      expect(bookmarksService.removeFromBookmarks).toHaveBeenCalled();
    });
  });
});
