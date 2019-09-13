import { Inject, Injectable } from '@angular/core';

import {
  AUTH_TOKEN,
  EnvConfig,
  Environment,
  StoragePlatformService
} from '@bookapp/angular/core';

import {
  ErrorEventData,
  ProgressEventData,
  Request,
  ResultEventData,
  session
} from 'nativescript-background-http';
import { BehaviorSubject, Observable } from 'rxjs';

const s = session('image-upload');

@Injectable()
export class UploadService {
  private progress = new BehaviorSubject<number>(0);

  constructor(
    private readonly storageService: StoragePlatformService,
    @Inject(Environment) private readonly environment: EnvConfig
  ) {}

  get progress$() {
    return this.progress.asObservable();
  }

  upload(fileUrl: string, name: string = 'file'): Observable<string> {
    return new Observable(observer => {
      const token = this.storageService.getItem(AUTH_TOKEN);

      const request: Request = {
        url: this.environment.uploadUrl,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        description: 'uploading'
      };

      const params = [{ name, filename: fileUrl, mimeType: 'image/png' }];

      const task = s.multipartUpload(params, request);

      task.on('progress', (e: ProgressEventData) => {
        this.progress.next(Math.round((e.currentBytes * 100) / e.totalBytes));
      });

      task.on('error', (err: ErrorEventData) => {
        observer.error(err);
      });

      task.on('responded', (e: ResultEventData) => {
        observer.next(e.data);
        observer.complete();
      });
    });
  }
}
