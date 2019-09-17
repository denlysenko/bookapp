import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DropModule } from '../drop/drop.module';
import { FileSelectorComponent } from './file-selector.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    DropModule
  ],
  declarations: [FileSelectorComponent],
  exports: [FileSelectorComponent],
  entryComponents: [FileSelectorComponent]
})
export class FileSelectorModule {}
