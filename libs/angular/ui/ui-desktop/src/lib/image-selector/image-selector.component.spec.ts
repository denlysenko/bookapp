// tslint:disable: no-identical-functions
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { UploadPlatformService } from '@bookapp/angular/core';
import { dataUriImage } from '@bookapp/testing';

import { of, throwError } from 'rxjs';

import { ImageSelectorComponent } from './image-selector.component';

const publicUrl = '/uploads/publicUrl';
const imageEvent = { image: 'test' };
const croppedEvent: any = { base64: dataUriImage };

describe('ImageSelectorComponent', () => {
  let component: ImageSelectorComponent;
  let fixture: ComponentFixture<ImageSelectorComponent>;
  let uploadService: UploadPlatformService;
  let dialog: MatDialogRef<any>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatDialogModule],
        declarations: [ImageSelectorComponent],
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
          {
            provide: MAT_DIALOG_DATA,
            useValue: {},
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectorComponent);
    component = fixture.componentInstance;
    uploadService = TestBed.inject(UploadPlatformService);
    dialog = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cropperReady()', () => {
    it('should emit true into cropperReady$', (done) => {
      component.onCropperReady();

      component.cropperReady$.subscribe((ready) => {
        expect(ready).toEqual(true);
        done();
      });
    });
  });

  describe('loadImageFail()', () => {
    beforeEach(() => {
      component.onLoadImageFail();
    });

    it('should propagate error', (done) => {
      component.error$.subscribe((err) => {
        expect(err).toEqual('INVALID_IMG_ERR');
        done();
      });
    });

    it('should propagate false to cropperReady$', (done) => {
      component.cropperReady$.subscribe((ready) => {
        expect(ready).toEqual(false);
        done();
      });
    });

    it('should propagate null to imageChangedEvent$', (done) => {
      component.imageChangedEvent$.subscribe((event) => {
        expect(event).toEqual(null);
        done();
      });
    });
  });

  describe('imageCropped()', () => {
    it('should save image', () => {
      component.imageCropped(croppedEvent);
      expect(component['croppedImage']).toEqual(dataUriImage);
    });
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
    it('should not upload if there is no croppedImage', () => {
      component.save();
      expect(uploadService.upload).not.toHaveBeenCalled();
    });

    it('should upload image', () => {
      component.imageCropped(croppedEvent);
      component.save();
      expect(uploadService.upload).toHaveBeenCalled();
    });

    it('should close dialog with publicUrl', () => {
      component.imageCropped(croppedEvent);
      component.save();
      expect(dialog.close).toHaveBeenCalledWith(publicUrl);
    });

    it('should propagate false to cropperReady$ if error', (done) => {
      jest.spyOn(uploadService, 'upload').mockImplementationOnce(() => throwError({}));

      component.imageCropped(croppedEvent);
      component.save();

      component.cropperReady$.subscribe((ready) => {
        expect(ready).toEqual(false);
        done();
      });
    });
  });
});
