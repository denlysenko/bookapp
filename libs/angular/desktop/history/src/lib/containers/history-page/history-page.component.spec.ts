import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreService } from '@bookapp/angular/core';
import { LogsService } from '@bookapp/angular/data-access';
import { log, MockAngularLogsService, MockStoreService } from '@bookapp/testing';

import { HistoryModule } from '../../history.module';
import { HistoryPageComponent } from './history-page.component';

describe('HistoryPageComponent', () => {
  let component: HistoryPageComponent;
  let fixture: ComponentFixture<HistoryPageComponent>;
  let logsService: LogsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HistoryModule, NoopAnimationsModule, RouterTestingModule],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {}),
        },
        {
          provide: StoreService,
          useValue: MockStoreService,
        },
      ],
    })
      .overrideComponent(HistoryPageComponent, {
        set: {
          providers: [
            {
              provide: LogsService,
              useValue: MockAngularLogsService,
            },
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    logsService = fixture.debugElement.injector.get(LogsService);
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
