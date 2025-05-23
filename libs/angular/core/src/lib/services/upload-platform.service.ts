import { Observable } from 'rxjs';

export abstract class UploadPlatformService {
  abstract progress$: Observable<number>;
  abstract upload(file: File | Blob | string, name?: string): Observable<string>;
  abstract deleteFile(file: string): Observable<string>;
}
