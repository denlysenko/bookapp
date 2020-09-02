import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BookmarksService } from '@bookapp/angular/data-access';
import { BOOKMARKS } from '@bookapp/shared/enums';
import { book, bookmark, MockAngularBookmarksService } from '@bookapp/testing';

import { of } from 'rxjs';

import { BookmarksModule } from '../../bookmarks.module';
import { BookmarksPageComponent } from './bookmarks-page.component';

const title = 'Favorite Books';

describe('BookmarksPageComponent', () => {
  let component: BookmarksPageComponent;
  let fixture: ComponentFixture<BookmarksPageComponent>;
  let bookmarksService: BookmarksService;

  beforeAll(() => {
    (window as any).IntersectionObserver = jest.fn(() => ({
      observe: () => null,
      disconnect: () => null,
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
                type: BOOKMARKS.FAVORITES,
              },
            },
            data: of({
              title,
            }),
          },
        },
      ],
    })
      .overrideComponent(BookmarksPageComponent, {
        set: {
          providers: [
            {
              provide: BookmarksService,
              useValue: MockAngularBookmarksService,
            },
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    bookmarksService = fixture.debugElement.injector.get(BookmarksService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title$', (done) => {
    component.title$.subscribe((res) => {
      expect(res).toEqual(title);
      done();
    });
  });

  describe('books$', () => {
    it('should have books', (done) => {
      component.books$.subscribe((books) => {
        expect(books).toEqual([bookmark.book]);
        done();
      });
    });
  });

  describe('loadMore()', () => {
    it('should not fetch more bookmarks if there are no more items', () => {
      component.loadMore();
      expect(bookmarksService.fetchMoreBookmarksByType).toHaveBeenCalledTimes(0);
    });

    it('should fetch more bookmarks if there are more items', () => {
      jest
        .spyOn(bookmarksService, 'watchBookmarksByType')
        .mockImplementationOnce(() =>
          of({ data: { bookmarks: { rows: [bookmark], count: 2 } } } as any)
        );

      fixture = TestBed.createComponent(BookmarksPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.loadMore();
      expect(bookmarksService.fetchMoreBookmarksByType).toHaveBeenCalledTimes(1);
      expect(bookmarksService.fetchMoreBookmarksByType).toHaveBeenCalledWith(10);
    });
  });

  describe('rate()', () => {
    it('should rate book', fakeAsync(() => {
      const event = { bookId: book._id, rate: 5 };
      component.rate(event);
      tick();
      expect(bookmarksService.rateBook).toHaveBeenCalledWith(event);
    }));
  });
});
