import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { FeedbackPlatformService, UploadPlatformService } from '@bookapp/angular/core';
import { AddBookService } from '@bookapp/angular/data-access';
import {
  book,
  MockAngularAddBookService,
  MockFeedbackPlatformService,
  MockMatDialog,
} from '@bookapp/testing';

import { of } from 'rxjs';

import { AddBookFormComponent } from '../../components/add-book-form/add-book-form.component';
import { AddBookPageComponent } from './add-book-page.component';

const formValue = {
  title: book.title,
  author: book.author,
  description: book.description,
  paid: book.paid,
  coverUrl: book.coverUrl,
  epubUrl: book.epubUrl,
};

describe('AddBookPageComponent', () => {
  let component: AddBookPageComponent;
  let fixture: ComponentFixture<AddBookPageComponent>;
  let addBookService: AddBookService;
  let feedbackService: FeedbackPlatformService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, MatCheckboxModule],
        declarations: [AddBookPageComponent, AddBookFormComponent],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: FeedbackPlatformService,
            useValue: MockFeedbackPlatformService,
          },
          {
            provide: MatDialog,
            useValue: MockMatDialog,
          },
          {
            provide: AddBookService,
            useValue: MockAngularAddBookService,
          },
          {
            provide: ActivatedRoute,
            useValue: {
              data: of({ book: null }),
            },
          },
          {
            provide: UploadPlatformService,
            useValue: {
              deleteFile: jest.fn().mockImplementation(() => of(true)),
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    addBookService = TestBed.inject(AddBookService);
    feedbackService = TestBed.inject(FeedbackPlatformService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('save()', () => {
    it('should create book', () => {
      component.save(formValue);
      expect(addBookService.create).toHaveBeenCalledWith(formValue);
    });

    it('should update book', () => {
      component.save({ _id: book._id, ...formValue });
      expect(addBookService.update).toHaveBeenCalledWith(book._id, formValue);
    });

    it('should show success message', () => {
      component.save(formValue);
      expect(feedbackService.success).toHaveBeenCalled();
    });

    it('should propagate error', (done) => {
      const error: any = { message: 'Error message' };
      jest.spyOn(addBookService, 'create').mockImplementationOnce(() => of({ errors: [error] }));

      component.save(formValue);
      component.error$.subscribe((err) => {
        expect(err).toEqual(error);
        done();
      });
    });
  });
});
