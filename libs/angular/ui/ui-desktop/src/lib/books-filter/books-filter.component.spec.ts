import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DEFAULT_SORT_VALUE } from '@bookapp/angular/data-access';

import { BooksFilterComponent } from './books-filter.component';

describe('BooksFilterComponent', () => {
  let component: BooksFilterComponent;
  let fixture: ComponentFixture<BooksFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BooksFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('searchQuery', () => {
    it('should be empty by default', () => {
      expect(component.searchQuery.value).toEqual(null);
    });

    it('should be set from filter input', () => {
      fixture.componentRef.setInput('filter', { searchQuery: 'test', sortValue: null });
      fixture.detectChanges();
      expect(component.searchQuery.value).toEqual('test');
    });
  });

  describe('sortValue', () => {
    it('should be have default value', () => {
      expect(component.sortValue).toEqual(DEFAULT_SORT_VALUE);
    });

    it('should be set from filter input', () => {
      fixture.componentRef.setInput('filter', { searchQuery: null, sortValue: 'title_desc' });
      fixture.detectChanges();
      expect(component.sortValue).toEqual('title_desc');
    });
  });

  describe('searchChanged', () => {
    beforeEach(() => {
      jest.spyOn(component.searchChanged, 'emit');
    });

    it('should emit searchChanged', fakeAsync(() => {
      const inputEl = fixture.debugElement.nativeElement.querySelector('input');
      inputEl.value = 'test';
      inputEl.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      tick(500);

      expect(component.searchChanged.emit).toHaveBeenCalledWith('test');
    }));
  });

  describe('sortChanged', () => {
    beforeEach(() => {
      jest.spyOn(component.sortChanged, 'emit');
    });

    it('should emit sortChanged', () => {
      const btnEl = fixture.debugElement.nativeElement
        .querySelector('mat-button-toggle[value=views_desc]')
        .querySelector('button');

      btnEl.click();
      fixture.detectChanges();

      expect(component.sortChanged.emit).toHaveBeenCalledWith('views_desc');
    });
  });
});
