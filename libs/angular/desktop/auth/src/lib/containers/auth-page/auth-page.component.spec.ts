import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FeedbackPlatformService, RouterExtensions } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import {
  authPayload,
  MockFeedbackPlatformService,
  MockRouterExtensions,
} from '@bookapp/testing/angular';

import { of } from 'rxjs';

import { AuthPageComponent } from './auth-page.component';

const email = 'test@test.com';
const password = 'pass';

describe('AuthPageComponent', () => {
  let component: AuthPageComponent;
  let fixture: ComponentFixture<AuthPageComponent>;
  let authService: AuthService;
  let router: RouterExtensions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthPageComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockImplementation(() => of({ data: authPayload })),
            signup: jest.fn().mockImplementation(() => of({ data: authPayload })),
          },
        },
        {
          provide: RouterExtensions,
          useValue: MockRouterExtensions,
        },
        {
          provide: FeedbackPlatformService,
          useValue: MockFeedbackPlatformService,
        },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(RouterExtensions);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    it('should login', () => {
      const credentials = { email, password };
      component.submit({ isLoggingIn: true, credentials });
      expect(authService.login).toHaveBeenCalledWith(credentials.email, credentials.password);
    });

    it('should signup', () => {
      const credentials = {
        email,
        password,
        firstName: 'First Name',
        lastName: 'Last Name',
      };
      component.submit({ isLoggingIn: false, credentials });
      expect(authService.signup).toHaveBeenCalledWith(credentials);
    });

    it('should navigate to main page if success', () => {
      const credentials = { email, password };
      component.submit({ isLoggingIn: true, credentials });
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should propagate error', fakeAsync(() => {
      const error = { message: 'Error' };

      jest.spyOn(authService, 'login').mockImplementationOnce(() => of({ errors: [error] }));

      component.submit({
        isLoggingIn: true,
        credentials: { email, password },
      });
      tick();

      expect(component.error()).toEqual(error);
    }));
  });
});
