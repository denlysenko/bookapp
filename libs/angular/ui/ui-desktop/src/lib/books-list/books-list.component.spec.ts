import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { book } from '@bookapp/testing/angular';

import { BooksListComponent } from './books-list.component';

describe('BooksListComponent', () => {
  let component: BooksListComponent;
  let fixture: ComponentFixture<BooksListComponent>;

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).IntersectionObserver = jest.fn(() => ({
      observe: () => null,
      disconnect: () => null,
    }));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BooksListComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('books', [book]);
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
      bookId: book.id,
      rate: 3,
    });
  });
});
