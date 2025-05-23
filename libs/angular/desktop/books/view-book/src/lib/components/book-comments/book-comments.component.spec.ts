import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCommentsComponent } from './book-comments.component';

describe('BookCommentsComponent', () => {
  let component: BookCommentsComponent;
  let fixture: ComponentFixture<BookCommentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookCommentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookCommentsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('comments', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('commentAdded', () => {
    let button: HTMLButtonElement;
    let textArea: HTMLTextAreaElement;

    beforeEach(() => {
      jest.spyOn(component.commentAdded, 'emit');
      button = fixture.nativeElement.querySelector('button');
      textArea = fixture.nativeElement.querySelector('textarea');
    });

    it('should emit commentAdded event', () => {
      const comment = 'new comment';

      textArea.value = comment;
      textArea.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      button.click();

      expect(component.commentAdded.emit).toHaveBeenCalledWith(comment);
    });
  });
});
