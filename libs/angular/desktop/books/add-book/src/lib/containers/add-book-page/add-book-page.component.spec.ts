import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { FeedbackPlatformService, UploadPlatformService } from '@bookapp/angular/core';
import { AddBookService } from '@bookapp/angular/data-access';
import {
  book,
  MockAngularAddBookService,
  MockFeedbackPlatformService,
  MockMatDialog,
} from '@bookapp/testing/angular';

import { of } from 'rxjs';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddBookPageComponent],
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
  });

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
      component.save({ id: book.id, ...formValue });
      expect(addBookService.update).toHaveBeenCalledWith(book.id, formValue);
    });

    it('should show success message', () => {
      component.save(formValue);
      expect(feedbackService.success).toHaveBeenCalled();
    });

    it('should propagate error', async () => {
      const error = { message: 'Error message' };
      jest.spyOn(addBookService, 'create').mockImplementationOnce(() => of({ errors: [error] }));

      component.save(formValue);
      await fixture.whenStable();
      expect(component.error()).toEqual(error);
    });
  });
});
