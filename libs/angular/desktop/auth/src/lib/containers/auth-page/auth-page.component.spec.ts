import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterExtensions } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import { authPayload, MockRouterExtensions } from '@bookapp/testing';

import { of } from 'rxjs';

import { AuthPageComponent } from './auth-page.component';

const email = 'test@test.com';
// tslint:disable-next-line: no-hardcoded-credentials
const password = 'pass';

describe('AuthPageComponent', () => {
  let component: AuthPageComponent;
  let fixture: ComponentFixture<AuthPageComponent>;
  let authService: AuthService;
  let router: RouterExtensions;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest
              .fn()
              .mockImplementation(() => of({ data: authPayload })),
            signup: jest
              .fn()
              .mockImplementation(() => of({ data: authPayload }))
          }
        },
        {
          provide: RouterExtensions,
          useValue: MockRouterExtensions
        }
      ]
    }).compileComponents();

    authService = TestBed.get(AuthService);
    router = TestBed.get(RouterExtensions);
  }));

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
      expect(authService.login).toHaveBeenCalledWith(
        credentials.email,
        credentials.password
      );
    });

    it('should signup', () => {
      const credentials = {
        email,
        password,
        firstName: 'First Name',
        lastName: 'Last Name'
      };
      component.submit({ isLoggingIn: false, credentials });
      expect(authService.signup).toHaveBeenCalledWith(credentials);
    });

    it('should navigate to main page if success', () => {
      const credentials = { email, password };
      component.submit({ isLoggingIn: true, credentials });
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should propagate error', done => {
      const error: any = { message: 'Error' };

      jest
        .spyOn(authService, 'login')
        .mockImplementationOnce(() => of({ errors: [error] }));

      let result: any;

      component.error$.subscribe(err => {
        result = err;
        done();
      });

      component.submit({
        isLoggingIn: true,
        credentials: { email, password }
      });

      expect(result).toEqual(error);
    });
  });
});
