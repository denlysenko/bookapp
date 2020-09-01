import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService, LogsService } from '@bookapp/angular/data-access';
import { log, MockAngularAuthService, MockAngularLogsService, user } from '@bookapp/testing';

import { MainLayoutModule } from '../../main-layout.module';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let logsService: LogsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MainLayoutModule, NoopAnimationsModule, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: MockAngularAuthService,
        },
      ],
    })
      .overrideComponent(MainLayoutComponent, {
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
    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    logsService = fixture.debugElement.injector.get(LogsService);
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
