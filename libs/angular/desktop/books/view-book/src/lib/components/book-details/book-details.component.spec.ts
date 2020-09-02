import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { RatingModule } from '@bookapp/angular/ui-desktop';
import { BOOKMARKS, ROLES } from '@bookapp/shared/enums';
import { book, user } from '@bookapp/testing';

import { BookDetailsComponent } from './book-details.component';

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RatingModule, MatIconModule, RouterTestingModule],
      declarations: [BookDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
    component.book = book;
    component.bookmarks = [];
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
        bookId: book._id,
      });
    });
  });

  describe('bookmarkRemoved', () => {
    let button: HTMLButtonElement;

    beforeEach(() => {
      jest.spyOn(component.bookmarkRemoved, 'emit');
      component.bookmarks = [BOOKMARKS.FAVORITES];
      fixture.detectChanges();
      button = fixture.nativeElement.querySelector('#favorites');
      button.click();
    });

    it('should emit bookmarkRemoved event', () => {
      expect(component.bookmarkRemoved.emit).toHaveBeenCalledWith({
        type: BOOKMARKS.FAVORITES,
        bookId: book._id,
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
        bookId: book._id,
        rate: 3,
      });
    });
  });

  describe('isAdmin', () => {
    it('should hide edit link', () => {
      expect(fixture.nativeElement.querySelector('#edit')).toBeNull();
    });

    it('should show edit link', () => {
      component.user = { ...user, roles: [ROLES.ADMIN] };
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('#edit')).not.toBeNull();
    });
  });
});
