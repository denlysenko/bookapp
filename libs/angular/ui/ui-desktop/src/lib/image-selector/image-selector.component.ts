import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FileSelectorBase } from '@bookapp/angular/base';
import { errorsMap } from '@bookapp/shared/constants';

import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

import { DropDirective } from '../drop/drop.directive';

interface ImageSelectorData {
  readonly maintainAspectRatio?: boolean;
}

@Component({
  selector: 'bookapp-image-selector',
  imports: [
    AsyncPipe,
    MatDialogModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    ImageCropperComponent,
    DropDirective,
  ],
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSelectorComponent extends FileSelectorBase implements OnInit {
  readonly #dialogRef = inject(MatDialogRef<ImageSelectorComponent>);
  readonly #data = inject<ImageSelectorData>(MAT_DIALOG_DATA);

  readonly progress$ = this.uploadService.progress$;

  maintainAspectRatio = true;

  readonly croppedImage = signal<Blob>(undefined);
  readonly cropperReady = signal(false);

  ngOnInit(): void {
    if (this.#data && 'maintainAspectRatio' in this.#data) {
      this.maintainAspectRatio = this.#data.maintainAspectRatio;
    }
  }

  onLoadImageFail() {
    this.error.set(errorsMap.INVALID_IMG_ERR);
    this.cropperReady.set(false);
    this.file.set(null);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage.set(event.blob);
  }

  save() {
    if (!this.croppedImage()) {
      return;
    }

    this.upload(this.croppedImage()).subscribe({
      next: ({ publicUrl }) => {
        this.#dialogRef.close(publicUrl);
      },
      error: () => this.cropperReady.set(false),
    });
  }
}
