import { Injectable } from '@angular/core';

import { getString, remove, setString } from '@nativescript/core/application-settings';

@Injectable()
export class StorageService {
  getItem(key: string): any {
    return getString(key);
  }

  setItem(key: string, value: any) {
    setString(key, value);
  }

  removeItem(key: string) {
    remove(key);
  }
}
