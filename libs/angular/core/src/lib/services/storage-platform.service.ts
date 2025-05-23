export abstract class StoragePlatformService {
  abstract getItem(key: string): string;
  abstract setItem(key: string, value: string): void;
  abstract removeItem(key: string): void;
}
