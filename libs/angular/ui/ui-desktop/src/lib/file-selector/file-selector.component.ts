import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { FileSelectorBase } from '@bookapp/angular/base';
import { UploadPlatformService } from '@bookapp/angular/core';

@Component({
  selector: 'bookapp-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSelectorComponent extends FileSelectorBase {
  progress$ = this.uploadService.progress$;

  constructor(
    uploadService: UploadPlatformService,
    private readonly dialogRef: MatDialogRef<FileSelectorComponent>
  ) {
    super(uploadService);
  }

  save() {
    const imageChangedEvent = this.imageChangedEvent.getValue();

    if (!imageChangedEvent) {
      return;
    }

    this.upload(imageChangedEvent.target.files[0]).subscribe(
      ({ publicUrl }) => {
        this.dialogRef.close(publicUrl);
      },
      () => this.imageChangedEvent.next(null)
    );
  }
}
