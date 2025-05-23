import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UploadPlatformService } from '@bookapp/angular/core';
import { errorsMap } from '@bookapp/shared/constants';
import { dataUriImage } from '@bookapp/testing/angular';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { of, throwError } from 'rxjs';

import { ImageSelectorComponent } from './image-selector.component';

const publicUrl = '/uploads/publicUrl';
const blob = new Blob([dataUriImage], { type: 'image/jpeg' });
const imageEvent = { target: { files: { 0: 'test' } } } as unknown as Event;
const croppedEvent = { blob } as ImageCroppedEvent;

describe('ImageSelectorComponent', () => {
  let component: ImageSelectorComponent;
  let fixture: ComponentFixture<ImageSelectorComponent>;
  let uploadService: UploadPlatformService;
  let dialog: MatDialogRef<ImageSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImageSelectorComponent],
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
  });

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

  describe('loadImageFail()', () => {
    beforeEach(() => {
      component.onLoadImageFail();
    });

    it('should propagate error', () => {
      expect(component['error']()).toEqual(errorsMap.INVALID_IMG_ERR);
    });

    it('should propagate false to cropperReady', () => {
      expect(component.cropperReady()).toEqual(false);
    });

    it('should update file in state', () => {
      expect(component['file']()).toEqual(null);
    });
  });

  describe('imageCropped()', () => {
    it('should save image', () => {
      component.imageCropped(croppedEvent);
      expect(component.croppedImage()).toEqual(blob);
    });
  });

  describe('onFileChange()', () => {
    beforeEach(() => {
      component.onFileChange(imageEvent);
    });

    it('should propagate null to error$', () => {
      expect(component['error']()).toEqual(null);
    });

    it('should update file in state', () => {
      expect(component['file']()).toEqual('test');
    });
  });

  describe('onFileDrop()', () => {
    beforeEach(() => {
      component.onFileDrop({ dataTransfer: imageEvent.target } as unknown as DragEvent);
    });

    it('should propagate null to error', () => {
      expect(component['error']()).toEqual(null);
    });

    it('should update file in state', () => {
      expect(component['file']()).toEqual('test');
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

    it('should propagate false to cropperReady if error', () => {
      jest
        .spyOn(uploadService, 'upload')
        .mockImplementationOnce(() => throwError(() => new Error('Upload error')));

      component.imageCropped(croppedEvent);
      component.save();

      expect(component.cropperReady()).toEqual(false);
    });
  });
});
