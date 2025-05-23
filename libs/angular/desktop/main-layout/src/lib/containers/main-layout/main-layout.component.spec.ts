import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService, LogsService } from '@bookapp/angular/data-access';
import {
  log,
  MockAngularAuthService,
  MockAngularLogsService,
  user,
} from '@bookapp/testing/angular';

import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let logsService: LogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: MockAngularAuthService,
        },
        {
          provide: LogsService,
          useValue: MockAngularLogsService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    logsService = TestBed.inject(LogsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('user$', () => {
    it('should have user', (done) => {
      component.user$.subscribe((u) => {
        expect(u).toMatchObject(user);
        done();
      });
    });

    it('should subscribe to logs', () => {
      expect(logsService.subscribeToNewLogs).toHaveBeenCalled();
    });
  });

  describe('logs$', () => {
    it('should have logs', (done) => {
      component.logs$.subscribe((logs) => {
        const [l] = logs;
        expect(l.action).toEqual(log.action);
        done();
      });
    });
  });

  describe('logout()', () => {
    it('should call authService.logout()', () => {
      const authService: AuthService = TestBed.inject(AuthService);
      component.logout();
      expect(authService.logout).toHaveBeenCalled();
    });
  });
});
