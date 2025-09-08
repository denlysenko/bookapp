import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FeedbackPlatformService, RouterExtensions, WebauthnService } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import {
  authenticationOptions,
  authPayload,
  MockFeedbackPlatformService,
  MockRouterExtensions,
} from '@bookapp/testing/angular';

import { of, throwError } from 'rxjs';

import { AuthPageComponent } from './auth-page.component';

const email = 'test@test.com';
const password = 'pass';

describe('AuthPageComponent', () => {
  let component: AuthPageComponent;
  let fixture: ComponentFixture<AuthPageComponent>;
  let authService: AuthService;
  let router: RouterExtensions;
  let webauthnService: WebauthnService;
  let feedbackService: FeedbackPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthPageComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockImplementation(() => of({ data: authPayload })),
            signup: jest.fn().mockImplementation(() => of({ data: authPayload })),
            startPasskeyAuthentication: jest
              .fn()
              .mockImplementation(() => of(authenticationOptions)),
            verifyPasskeyAuthentication: jest
              .fn()
              .mockImplementation(() => of({ data: authPayload })),
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
        {
          provide: WebauthnService,
          useValue: {
            getCredentials: jest.fn().mockResolvedValue({ id: 'test-credential-id', response: {} }),
          },
        },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(RouterExtensions);
    webauthnService = TestBed.inject(WebauthnService);
    feedbackService = TestBed.inject(FeedbackPlatformService);
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

  describe('loginWithPasskey()', () => {
    it('should start passkey authentication flow and call all services', fakeAsync(() => {
      component.loginWithPasskey();
      tick();

      expect(authService.startPasskeyAuthentication).toHaveBeenCalled();
      expect(webauthnService.getCredentials).toHaveBeenCalledWith(authenticationOptions);
      expect(authService.verifyPasskeyAuthentication).toHaveBeenCalledWith({
        id: 'test-credential-id',
        response: {},
      });
    }));

    it('should handle errors and show feedback', fakeAsync(() => {
      const error = new Error('Authentication failed');
      jest
        .spyOn(authService, 'startPasskeyAuthentication')
        .mockReturnValue(throwError(() => error));

      component.loginWithPasskey();
      tick();

      expect(feedbackService.error).toHaveBeenCalledWith('Error authenticating passkey');
    }));

    it('should handle webauthn service errors', fakeAsync(() => {
      const error = new Error('WebAuthn failed');
      jest.spyOn(webauthnService, 'getCredentials').mockRejectedValue(error);

      component.loginWithPasskey();
      tick();

      expect(feedbackService.error).toHaveBeenCalledWith('Error authenticating passkey');
    }));
  });
});
