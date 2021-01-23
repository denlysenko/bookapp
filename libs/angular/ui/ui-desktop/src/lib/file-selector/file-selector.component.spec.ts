// tslint:disable: no-identical-functions
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { UploadPlatformService } from '@bookapp/angular/core';

import { of, throwError } from 'rxjs';

import { FileSelectorComponent } from './file-selector.component';

const publicUrl = '/uploads/publicUrl';
const imageEvent = { target: { files: { 0: 'test' } } };

describe('FileSelectorComponent', () => {
  let component: FileSelectorComponent;
  let fixture: ComponentFixture<FileSelectorComponent>;
  let uploadService: UploadPlatformService;
  let dialog: MatDialogRef<any>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatDialogModule],
        declarations: [FileSelectorComponent],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: UploadPlatformService,
            useValue: {
              upload: jest.fn().mockImplementation(() => of(JSON.stringify({ publicUrl }))),
            },
          },
          {
            provide: MatDialogRef,
            useValue: {
              close: jest.fn(),
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    uploadService = TestBed.inject(UploadPlatformService);
    dialog = TestBed.inject(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFileChange()', () => {
    beforeEach(() => {
      component.onFileChange(imageEvent);
    });

    it('should propagate null to error$', (done) => {
      component.error$.subscribe((err) => {
        expect(err).toEqual(null);
        done();
      });
    });

    it('should propagate event to imageChangedEvent$', (done) => {
      component.imageChangedEvent$.subscribe((event) => {
        expect(event).toEqual(imageEvent);
        done();
      });
    });
  });

  describe('onFileDrop()', () => {
    beforeEach(() => {
      component.onFileDrop({ dataTransfer: { files: imageEvent } });
    });

    it('should propagate null to error$', (done) => {
      component.error$.subscribe((err) => {
        expect(err).toEqual(null);
        done();
      });
    });

    it('should propagate event to imageChangedEvent$', (done) => {
      component.imageChangedEvent$.subscribe((event) => {
        expect(event).toEqual({
          target: { files: imageEvent },
        });
        done();
      });
    });
  });

  describe('save()', () => {
    it('should not upload if there is no imageChangedEvent value', () => {
      component.save();
      expect(uploadService.upload).not.toHaveBeenCalled();
    });

    it('should upload file', () => {
      component.onFileChange(imageEvent);
      component.save();
      expect(uploadService.upload).toHaveBeenCalled();
    });

    it('should close dialog with publicUrl', () => {
      component.onFileChange(imageEvent);
      component.save();
      expect(dialog.close).toHaveBeenCalledWith(publicUrl);
    });

    it('should propagate null to imageChangedEvent$ if error', (done) => {
      jest.spyOn(uploadService, 'upload').mockImplementationOnce(() => throwError({}));

      component.onFileChange(imageEvent);
      component.save();

      component.imageChangedEvent$.subscribe((event) => {
        expect(event).toEqual(null);
        done();
      });
    });
  });
});
