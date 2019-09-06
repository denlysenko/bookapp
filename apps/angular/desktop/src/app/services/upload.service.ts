import { Inject, Injectable } from '@angular/core';

import {
  AUTH_TOKEN,
  EnvConfig,
  Environment,
  HTTP_STATUS,
  StoragePlatformService
} from '@bookapp/angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UploadService {
  constructor(
    private readonly storageService: StoragePlatformService,
    @Inject(Environment) private readonly environment: EnvConfig
  ) {}

  private progress = new BehaviorSubject<number>(0);

  get progress$() {
    return this.progress.asObservable();
  }

  upload(file: File | Blob, name: string = 'file'): Observable<string> {
    return new Observable(observer => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append(name, file);

      if (xhr.upload) {
        xhr.upload.addEventListener(
          'progress',
          (e: ProgressEvent) => {
            if (e.lengthComputable) {
              this.progress.next(Math.round((e.loaded * 100) / e.total));
            }
          },
          false
        );
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          this.progress.next(0);

          if (
            xhr.status === HTTP_STATUS.OK ||
            xhr.status === HTTP_STATUS.CREATED
          ) {
            observer.next(xhr.response);
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };

      const token = this.storageService.getItem(AUTH_TOKEN);

      xhr.open('POST', `${this.environment.uploadUrl}`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  }

  deleteFile(key: string): Observable<string> {
    return new Observable(observer => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (
            xhr.status === HTTP_STATUS.OK ||
            xhr.status === HTTP_STATUS.CREATED
          ) {
            observer.next(xhr.response);
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };

      const token = this.storageService.getItem(AUTH_TOKEN);

      xhr.open('DELETE', `${this.environment.uploadUrl}/${key}`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send();
    });
  }
}
