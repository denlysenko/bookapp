import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';

import { HistoryListComponent } from './history-list.component';

describe('HistoryListComponent', () => {
  let component: HistoryListComponent;
  let fixture: ComponentFixture<HistoryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HistoryListComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('sorting', {
      active: 'createdAt',
      direction: 'desc',
    });
    fixture.componentRef.setInput('pagination', {
      skip: 0,
      first: DEFAULT_LIMIT,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('sortChanged()', () => {
    beforeEach(() => {
      jest.spyOn(component.sortChanged, 'emit');

      const sortHeader = fixture.debugElement.nativeElement.querySelector(
        '.mat-sort-header-container'
      );
      sortHeader.click();
    });

    it('should emit sortChanged event', () => {
      expect(component.sortChanged.emit).toHaveBeenCalled();
    });
  });
});
