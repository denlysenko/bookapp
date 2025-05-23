import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FileSelectorBase } from '@bookapp/angular/base';

import { DropDirective } from '../drop/drop.directive';

@Component({
  selector: 'bookapp-file-selector',
  imports: [
    AsyncPipe,
    MatDialogModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    DropDirective,
  ],
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSelectorComponent extends FileSelectorBase {
  readonly #dialogRef = inject(MatDialogRef<FileSelectorComponent>);

  readonly progress$ = this.uploadService.progress$;

  save() {
    const file = this.file();

    if (!file) {
      return;
    }

    this.upload(file).subscribe({
      next: ({ publicUrl }) => {
        this.#dialogRef.close(publicUrl);
      },
      error: () => this.file.set(null),
    });
  }
}
