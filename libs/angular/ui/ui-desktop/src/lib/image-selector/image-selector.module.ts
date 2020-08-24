import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ImageCropperModule } from 'ngx-image-cropper';

import { DropModule } from '../drop/drop.module';
import { ImageSelectorComponent } from './image-selector.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    ImageCropperModule,
    DropModule,
  ],
  declarations: [ImageSelectorComponent],
  exports: [ImageSelectorComponent],
  entryComponents: [ImageSelectorComponent],
})
export class ImageSelectorModule {}
