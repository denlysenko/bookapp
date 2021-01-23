import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { BookCommentsComponent } from './book-comments.component';

describe('BookCommentsComponent', () => {
  let component: BookCommentsComponent;
  let fixture: ComponentFixture<BookCommentsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [BookCommentsComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BookCommentsComponent);
    component = fixture.componentInstance;
    component.comments = [];
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
