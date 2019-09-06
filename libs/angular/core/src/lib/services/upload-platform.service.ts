import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class UploadPlatformService {
  // all methods will be overwritten
  get progress$(): Observable<number> {
    return of(0);
  }

  upload(file: any, name: string = 'file'): Observable<string> {
    return of('');
  }
}
