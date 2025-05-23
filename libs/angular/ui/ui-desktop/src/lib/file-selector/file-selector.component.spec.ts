import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef } from '@angular/material/dialog';

import { UploadPlatformService } from '@bookapp/angular/core';

import { of, throwError } from 'rxjs';

import { FileSelectorComponent } from './file-selector.component';

const publicUrl = '/uploads/publicUrl';
const imageEvent = { target: { files: { 0: 'test' } } } as unknown as Event;

describe('FileSelectorComponent', () => {
  let component: FileSelectorComponent;
  let fixture: ComponentFixture<FileSelectorComponent>;
  let uploadService: UploadPlatformService;
  let dialog: MatDialogRef<FileSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FileSelectorComponent],
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
  });

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

    it('should propagate null to error', () => {
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

    it('should propagate null to error$', () => {
      expect(component['error']()).toEqual(null);
    });

    it('should update file in state', () => {
      expect(component['file']()).toEqual('test');
    });
  });

  describe('save()', () => {
    it('should not upload if there is no file', () => {
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

    it('should update file in state if error', () => {
      jest
        .spyOn(uploadService, 'upload')
        .mockImplementationOnce(() => throwError(() => new Error('Upload error')));

      component.onFileChange(imageEvent);
      component.save();

      expect(component['file']()).toEqual(null);
    });
  });
});
