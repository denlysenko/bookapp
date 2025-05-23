import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BOOKMARKS, ROLES } from '@bookapp/shared/enums';
import { book, user } from '@bookapp/testing/angular';

import { BookDetailsComponent } from './book-details.component';

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookDetailsComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('book', book);
    fixture.componentRef.setInput('bookmarks', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('bookmarkAdded', () => {
    let button: HTMLButtonElement;

    beforeEach(() => {
      jest.spyOn(component.bookmarkAdded, 'emit');
      button = fixture.nativeElement.querySelector('#favorites');
      button.click();
    });

    it('should emit bookmarkAdded event', () => {
      expect(component.bookmarkAdded.emit).toHaveBeenCalledWith({
        type: BOOKMARKS.FAVORITES,
        bookId: book.id,
      });
    });
  });

  describe('bookmarkRemoved', () => {
    let button: HTMLButtonElement;

    beforeEach(() => {
      jest.spyOn(component.bookmarkRemoved, 'emit');
      fixture.componentRef.setInput('bookmarks', [BOOKMARKS.FAVORITES]);
      fixture.detectChanges();
      button = fixture.nativeElement.querySelector('#favorites');
      button.click();
    });

    it('should emit bookmarkRemoved event', () => {
      expect(component.bookmarkRemoved.emit).toHaveBeenCalledWith({
        type: BOOKMARKS.FAVORITES,
        bookId: book.id,
      });
    });
  });

  describe('rate()', () => {
    it('should emit bookRated event', () => {
      jest.spyOn(component.bookRated, 'emit');

      const starEl = fixture.debugElement.nativeElement.querySelectorAll('.rating-star')[2];

      starEl.click();
      fixture.detectChanges();

      expect(component.bookRated.emit).toHaveBeenCalledWith({
        bookId: book.id,
        rate: 3,
      });
    });
  });

  describe('isAdmin', () => {
    it('should hide edit link', () => {
      expect(fixture.nativeElement.querySelector('#edit')).toBeNull();
    });

    it('should show edit link', () => {
      fixture.componentRef.setInput('user', { ...user, roles: [ROLES.ADMIN] });
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('#edit')).not.toBeNull();
    });
  });
});
