import { Injectable } from '@angular/core';
import { StoragePlatformService } from '@bookapp/angular/core';

@Injectable()
export class StorageService implements StoragePlatformService {
  #store: Record<string, string> = {};

  #isLocalStorageExists = !!window.localStorage;

  getItem(key: string): string {
    return this.#isLocalStorageExists ? localStorage.getItem(key) : this.#store[key];
  }

  setItem(key: string, value: string) {
    if (this.#isLocalStorageExists) {
      localStorage.setItem(key, value);
    } else {
      this.#store[key] = value;
    }
  }

  removeItem(key: string) {
    if (this.#isLocalStorageExists) {
      localStorage.removeItem(key);
    } else {
      delete this.#store[key];
    }
  }
}
