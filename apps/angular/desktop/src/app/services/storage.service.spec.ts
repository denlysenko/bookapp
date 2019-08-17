import { TestBed } from '@angular/core/testing';

import { MockLocalStorage } from '@bookapp/testing';

import { StorageService } from './storage.service';

Object.defineProperty(window, 'localStorage', { value: MockLocalStorage });

describe('StorageService', () => {
  let service: StorageService;
  let getItemSpy: jest.SpyInstance<any>;
  let setItemSpy: jest.SpyInstance<any>;
  let removeItemSpy: jest.SpyInstance<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });

    service = TestBed.get(StorageService);

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
