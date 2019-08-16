import { Injectable } from '@angular/core';

@Injectable()
export class StoragePlatformService {
  getItem(key: string): any {}
  setItem(key: string, value: string) {}
  removeItem(key: string) {}
}
