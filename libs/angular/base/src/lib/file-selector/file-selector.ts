import { inject, signal } from '@angular/core';

import { UploadPlatformService } from '@bookapp/angular/core';
import { UploadResponse } from '@bookapp/shared/interfaces';

import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export abstract class FileSelectorBase {
  protected readonly uploadService = inject(UploadPlatformService);
  protected readonly error = signal<string>(undefined);
  protected readonly file = signal<File | null>(null);

  readonly loading = signal(false);

  onFileChange(event: Event) {
    this.error.set(null);
    this.file.set((event.target as HTMLInputElement).files[0]);
  }

  onFileDrop(event: DragEvent) {
    this.error.set(null);
    this.file.set(event.dataTransfer.files[0]);
  }

  upload(file: File | Blob): Observable<UploadResponse> {
    this.loading.set(true);

    return this.uploadService.upload(file).pipe(
      tap(() => {
        this.loading.set(false);
      }),
      map((response) => JSON.parse(response)),
      catchError((err) => {
        this.loading.set(false);
        this.file.set(null);
        const error = JSON.parse(err);
        this.error.set(error.message);
        return throwError(() => error);
      })
    );
  }
}
