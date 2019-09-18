// tslint:disable: no-duplicate-string
// tslint:disable: no-big-function
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import {
  FeedbackPlatformService,
  UploadPlatformService
} from '@bookapp/angular/core';
import { book, MockFeedbackPlatformService } from '@bookapp/testing';

import { of } from 'rxjs';

import { AddBookFormComponent } from './add-book-form.component';

const clickOnBtn = (
  fixture: ComponentFixture<AddBookFormComponent>,
  selector = 'button'
) => {
  const btn = fixture.debugElement.query(By.css(selector)).nativeElement;
  btn.click();
  fixture.detectChanges();
};

const publicUrl = 'uploads/publicUrl';

const formValue = {
  _id: book._id,
  title: book.title,
  author: book.author,
  description: book.description,
  paid: book.paid,
  coverUrl: book.coverUrl,
  epubUrl: book.epubUrl
};

const COVER_BTN = '#cover-btn';
const EPUB_BTN = '#epub-btn';

describe('AddBookFormComponent', () => {
  let component: AddBookFormComponent;
  let fixture: ComponentFixture<AddBookFormComponent>;
  let dialog: MatDialog;
  let uploadService: UploadPlatformService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatCheckboxModule],
      declarations: [AddBookFormComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: FeedbackPlatformService,
          useValue: MockFeedbackPlatformService
        },
        {
          provide: UploadPlatformService,
          useValue: {
            deleteFile: jest.fn().mockImplementation(() => of(true))
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockImplementation(() => ({
              afterClosed: jest.fn().mockReturnValue(of(publicUrl))
            }))
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialog = TestBed.get(MatDialog);
    uploadService = TestBed.get(UploadPlatformService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form with empty values', () => {
    expect(component.form.value).toMatchObject({
      _id: null,
      title: null,
      author: null,
      description: null,
      paid: false,
      price: null,
      coverUrl: null,
      epubUrl: null
    });
  });

  it('should patch form with values from book', () => {
    component.book = book;
    fixture.detectChanges();
    expect(component.form.value).toMatchObject(formValue);
  });

  it('should toggle price field', () => {
    const paidCheckbox = fixture.debugElement.query(By.directive(MatCheckbox));

    expect(component.paidControl.value).toEqual(false);
    expect(
      fixture.debugElement.query(By.css('[formcontrolname=price]'))
    ).toBeNull();

    paidCheckbox.nativeElement.querySelector('input').click();
    fixture.detectChanges();

    expect(component.paidControl.value).toEqual(true);
    expect(
      fixture.debugElement.query(By.css('[formcontrolname=price]'))
    ).not.toBeNull();
  });

  describe('Validations', () => {
    describe('title', () => {
      let titleField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        titleField = component.form.get('title');
        input = fixture.debugElement.query(
          By.css('input[formcontrolname=title]')
        ).nativeElement;
      });

      it('should have required error', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(titleField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(titleField.hasError('required')).toEqual(false);
      });
    });

    describe('author', () => {
      let authorField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        authorField = component.form.get('author');
        input = fixture.debugElement.query(
          By.css('input[formcontrolname=author]')
        ).nativeElement;
      });

      it('should have required error', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(authorField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(authorField.hasError('required')).toEqual(false);
      });
    });

    describe('description', () => {
      let descField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        descField = component.form.get('description');
        input = fixture.debugElement.query(
          By.css('[formcontrolname=description]')
        ).nativeElement;
      });

      it('should have required error', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(descField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(descField.hasError('required')).toEqual(false);
      });
    });

    describe('price', () => {
      let priceField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        fixture.debugElement
          .query(By.directive(MatCheckbox))
          .nativeElement.querySelector('input')
          .click();
        fixture.detectChanges();
        priceField = component.form.get('price');
        input = fixture.debugElement.query(By.css('[formcontrolname=price]'))
          .nativeElement;
      });

      it('should have required error', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(priceField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = '3';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(priceField.hasError('required')).toEqual(false);
      });
    });
  });

  describe('showCoverSelector()', () => {
    it('should open dialog', () => {
      clickOnBtn(fixture, COVER_BTN);
      expect(dialog.open).toHaveBeenCalled();
    });

    it('should patch form value if coverUrl returned', () => {
      clickOnBtn(fixture, COVER_BTN);
      expect(component.form.get('coverUrl').value).toEqual(publicUrl);
    });

    it('should not patch form value if coverUrl does not return', () => {
      dialog.open = jest.fn().mockImplementation(() => ({
        afterClosed: jest.fn().mockReturnValue(of(null))
      }));

      clickOnBtn(fixture, COVER_BTN);
      expect(component.form.get('coverUrl').value).toEqual(null);
    });
  });

  describe('showFileSelector()', () => {
    it('should open dialog', () => {
      clickOnBtn(fixture, EPUB_BTN);
      expect(dialog.open).toHaveBeenCalled();
    });

    it('should patch form value if epubUrl returned', () => {
      clickOnBtn(fixture, EPUB_BTN);
      expect(component.form.get('epubUrl').value).toEqual(publicUrl);
    });

    it('should not patch form value if epubUrl does not return', () => {
      dialog.open = jest.fn().mockImplementation(() => ({
        afterClosed: jest.fn().mockReturnValue(of(null))
      }));

      clickOnBtn(fixture, EPUB_BTN);
      expect(component.form.get('epubUrl').value).toEqual(null);
    });
  });

  describe('submit()', () => {
    beforeEach(() => {
      jest.spyOn(component.formSubmitted, 'emit');
    });

    it('should not emit formSubmitted if form is invalid', () => {
      component.submit();
      expect(component.formSubmitted.emit).not.toHaveBeenCalled();
    });

    it('should emit formSubmitted event', () => {
      component.form.patchValue(formValue);
      component.submit();
      expect(component.formSubmitted.emit).toHaveBeenCalledWith(formValue);
    });
  });

  describe('hasChanges()', () => {
    beforeEach(() => {
      component.book = book;
      fixture.detectChanges();
    });

    it('should not have changes', () => {
      expect(component.hasChanges()).toBeFalsy();
    });

    it('should have changes', () => {
      component.form.patchValue({ title: 'new title' });
      fixture.detectChanges();
      expect(component.hasChanges()).toBeTruthy();
    });
  });

  describe('removeUploadedFiles()', () => {
    describe('coverUrl', () => {
      it('should call uploadService.deleteFile if coverUrl has changed', () => {
        component.form.patchValue({ coverUrl: 'newCoverUrl' });
        fixture.detectChanges();
        component.removeUploadedFiles();
        expect(uploadService.deleteFile).toHaveBeenCalled();
      });

      it('should not call uploadService.deleteFile if coverUrl has not changed', () => {
        component.removeUploadedFiles();
        expect(uploadService.deleteFile).not.toHaveBeenCalled();
      });
    });

    describe('epubUrl', () => {
      it('should call uploadService.deleteFile if epubUrl has changed', () => {
        component.form.patchValue({ epubUrl: 'newEpubUrl' });
        fixture.detectChanges();
        component.removeUploadedFiles();
        expect(uploadService.deleteFile).toHaveBeenCalled();
      });

      it('should not call uploadService.deleteFile if epubUrl has not changed', () => {
        component.removeUploadedFiles();
        expect(uploadService.deleteFile).not.toHaveBeenCalled();
      });
    });
  });
});
