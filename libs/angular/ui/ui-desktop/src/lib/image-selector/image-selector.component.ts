import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileSelectorBase } from '@bookapp/angular/base';
import { UploadPlatformService } from '@bookapp/angular/core';
import { dataURIToBlob } from '@bookapp/utils';

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'bookapp-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSelectorComponent extends FileSelectorBase {
  progress$ = this.uploadService.progress$;
  maintainAspectRatio = true;

  private croppedImage: string;
  private cropperReady = new BehaviorSubject<boolean>(false);

  constructor(
    uploadService: UploadPlatformService,
    private readonly dialogRef: MatDialogRef<ImageSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: any
  ) {
    super(uploadService);
    if (this.data && 'maintainAspectRatio' in this.data) {
      this.maintainAspectRatio = data.maintainAspectRatio;
    }
  }

  get cropperReady$(): Observable<boolean> {
    return this.cropperReady.asObservable().pipe(shareReplay(1));
  }

  onCropperReady() {
    this.cropperReady.next(true);
  }

  onLoadImageFail() {
    this.error.next('INVALID_IMG_ERR');
    this.cropperReady.next(false);
    this.imageChangedEvent.next(null);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  save() {
    if (!this.croppedImage) {
      return;
    }

    this.upload(dataURIToBlob(this.croppedImage)).subscribe(
      ({ publicUrl }) => {
        this.dialogRef.close(publicUrl);
      },
      () => this.cropperReady.next(false)
    );
  }
}
