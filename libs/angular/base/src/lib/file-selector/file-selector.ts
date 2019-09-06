import { UploadPlatformService } from '@bookapp/angular/core';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export abstract class FileSelectorBase {
  constructor(protected readonly uploadService: UploadPlatformService) {}

  private imageChangedEvent = new BehaviorSubject<any>(null);
  private loading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string | undefined>(undefined);

  get imageChangedEvent$(): Observable<any> {
    return this.imageChangedEvent.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  get error$(): Observable<string | undefined> {
    return this.error.asObservable();
  }

  onFileChange(event: any) {
    this.error.next(null);
    this.imageChangedEvent.next(event);
  }

  onFileDrop(event: any) {
    this.error.next(null);
    this.imageChangedEvent.next({
      target: { files: event.dataTransfer.files }
    });
  }

  upload(file: File | Blob) {
    this.loading.next(true);

    this.uploadService.upload(file).pipe(
      tap(() => {
        this.loading.next(false);
      }),
      map(response => JSON.parse(response)),
      catchError(err => {
        this.loading.next(false);
        this.imageChangedEvent.next(null);
        const error = JSON.parse(err);
        this.error.next(error.message);
        return throwError(error);
      })
    );
  }
}
