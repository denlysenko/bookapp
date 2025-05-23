import { TestBed } from '@angular/core/testing';

import { MockLocalStorage } from '@bookapp/testing/angular';

import { StorageService } from './storage.service';

Object.defineProperty(window, 'localStorage', { value: MockLocalStorage });

describe('StorageService', () => {
  let service: StorageService;
  let getItemSpy: jest.SpyInstance<string>;
  let setItemSpy: jest.SpyInstance<void>;
  let removeItemSpy: jest.SpyInstance<void>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });

    service = TestBed.inject(StorageService);

    getItemSpy = jest.spyOn(window.localStorage, 'getItem');
    setItemSpy = jest.spyOn(window.localStorage, 'setItem');
    removeItemSpy = jest.spyOn(window.localStorage, 'removeItem');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItem()', () => {
    it('should get item from local storage', () => {
      service.getItem('test');
      expect(getItemSpy).toHaveBeenCalled();
    });
  });

  describe('setItem()', () => {
    it('should set item to local storage', () => {
      service.setItem('test', 'value');
      expect(setItemSpy).toHaveBeenCalled();
    });
  });
  describe('removeItem()', () => {
    it('should remove item from local storage', () => {
      service.removeItem('test');
      expect(removeItemSpy).toHaveBeenCalled();
    });
  });
});
