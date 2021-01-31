class Storage {
  private store = {};

  private isLocalStorageExists = !!window.localStorage;

  getItem(key: string): any {
    return this.isLocalStorageExists ? localStorage.getItem(key) : this.store[key];
  }

  setItem(key: string, value: any) {
    this.isLocalStorageExists ? localStorage.setItem(key, value) : (this.store[key] = value);
  }

  removeItem(key: string) {
    this.isLocalStorageExists ? localStorage.removeItem(key) : delete this.store[key];
  }
}

const storage = new Storage();

export { storage };
