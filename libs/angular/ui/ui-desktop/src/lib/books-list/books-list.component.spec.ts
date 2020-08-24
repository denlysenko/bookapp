import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { book } from '@bookapp/testing';

import { RatingModule } from '../rating/rating.module';
import { BooksListComponent } from './books-list.component';

describe('BooksListComponent', () => {
  let component: BooksListComponent;
  let fixture: ComponentFixture<BooksListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, RatingModule],
      declarations: [BooksListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksListComponent);
    component = fixture.componentInstance;
    component.books = [book];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
