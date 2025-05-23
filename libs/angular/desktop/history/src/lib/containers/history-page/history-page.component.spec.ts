import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StoreService } from '@bookapp/angular/core';
import { LogsService } from '@bookapp/angular/data-access';
import { log, MockAngularLogsService, MockStoreService } from '@bookapp/testing/angular';

import { HistoryPageComponent } from './history-page.component';

describe('HistoryPageComponent', () => {
  let component: HistoryPageComponent;
  let fixture: ComponentFixture<HistoryPageComponent>;
  let logsService: LogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HistoryPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: StoreService,
          useValue: MockStoreService,
        },
        {
          provide: LogsService,
          useValue: MockAngularLogsService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    logsService = TestBed.inject(LogsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logs', (done) => {
    component.logs$.subscribe((logs) => {
      const [l] = logs;
      expect(l.action).toEqual(log.action);
      done();
    });
  });

  it('should have count', (done) => {
    component.count$.subscribe((count) => {
      expect(count).toEqual(1);
      done();
    });
  });

  describe('sort()', () => {
    it('should refetch logs', () => {
      component.sort({ active: 'id', direction: 'desc' });
      expect(logsService.refetch).toHaveBeenCalledWith({
        orderBy: 'id_desc',
      });
    });
  });

  describe('paginate()', () => {
    it('should refetch logs', () => {
      component.paginate({ pageIndex: 2, pageSize: 10, length: 10 });
      expect(logsService.refetch).toHaveBeenCalledWith({
        skip: 20,
        first: 10,
      });
    });
  });
});
