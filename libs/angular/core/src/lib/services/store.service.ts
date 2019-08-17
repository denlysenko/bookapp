import { Injectable } from '@angular/core';

@Injectable()
export class StoreService {
  private store = new Map<string, any>();

  set(key: string, value: any) {
    this.store.set(key, value);
  }

  get(key: string) {
    return this.store.get(key);
  }

  remove(key: string) {
    this.store.delete(key);
  }
}
