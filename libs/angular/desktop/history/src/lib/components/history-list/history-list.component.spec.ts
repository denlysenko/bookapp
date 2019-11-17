import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { HistoryModule } from '../../history.module';
import { HistoryListComponent } from './history-list.component';

describe('HistoryListComponent', () => {
  let component: HistoryListComponent;
  let fixture: ComponentFixture<HistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HistoryModule, NoopAnimationsModule, RouterTestingModule],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('sortChanged()', () => {
    beforeEach(() => {
      jest.spyOn(component.sortChanged, 'emit');

      const sortHeader = fixture.debugElement.nativeElement.querySelector(
        '.mat-sort-header-button'
      );
      sortHeader.click();
    });

    it('should emit sortChanged event', () => {
      expect(component.sortChanged.emit).toHaveBeenCalled();
    });
  });
});
