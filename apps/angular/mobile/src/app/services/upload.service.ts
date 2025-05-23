import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Environment, StoreService, UploadPlatformService } from '@bookapp/angular/core';
import { AUTH_TOKEN } from '@bookapp/shared/constants';

import {
  ErrorEventData,
  ProgressEventData,
  Request,
  ResultEventData,
  session,
} from '@nativescript/background-http';

import { BehaviorSubject, Observable } from 'rxjs';

const s = session('image-upload');

@Injectable()
export class UploadService implements UploadPlatformService {
  readonly #http = inject(HttpClient);
  readonly #storeService = inject(StoreService);
  readonly #environment = inject(Environment);
  readonly #progress = new BehaviorSubject<number>(0);

  get progress$() {
    return this.#progress.asObservable();
  }

  upload(fileUrl: string, name = 'file'): Observable<string> {
    return new Observable((observer) => {
      const token = this.#storeService.get(AUTH_TOKEN);

      const request: Request = {
        url: this.#environment.uploadUrl,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        description: 'uploading',
      };

      const params = [{ name, filename: fileUrl, mimeType: 'image/png' }];

      const task = s.multipartUpload(params, request);

      task.on('progress', (e: ProgressEventData) => {
        this.#progress.next(Math.round((e.currentBytes * 100) / e.totalBytes));
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

  deleteFile(key: string): Observable<string> {
    return this.#http.delete<string>(`${this.#environment.uploadUrl}/${key}`, {
      headers: {
        Authorization: `Bearer ${this.#storeService.get(AUTH_TOKEN)}`,
      },
    });
  }
}
