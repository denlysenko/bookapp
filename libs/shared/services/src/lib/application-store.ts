export class ApplicationStore {
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
