import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { PasswordService } from '@bookapp/angular/data-access';
import { MockFeedbackPlatformService } from '@bookapp/testing';

import { of } from 'rxjs';

import { PasswordPageComponent } from './password-page.component';

// tslint:disable-next-line: no-hardcoded-credentials
const password = 'newPassword';
const oldPassword = 'oldPassword';

describe('PasswordPageComponent', () => {
  let component: PasswordPageComponent;
  let fixture: ComponentFixture<PasswordPageComponent>;
  let passwordService: PasswordService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: PasswordService,
          useValue: {
            changePassword: jest
              .fn()
              .mockImplementation(() => of({ data: { changePassword: true } }))
          }
        },
        {
          provide: FeedbackPlatformService,
          useValue: MockFeedbackPlatformService
        }
      ]
    }).compileComponents();

    passwordService = TestBed.get(PasswordService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changePassword()', () => {
    it('should change password', () => {
      component.changePassword({ oldPassword, password });
      expect(passwordService.changePassword).toHaveBeenCalledWith(
        password,
        oldPassword
      );
    });

    it('should propagate error', done => {
      const error: any = { message: 'Error' };

      jest
        .spyOn(passwordService, 'changePassword')
        .mockImplementationOnce(() => of({ errors: [error] }));

      let result: any;

      component.error$.subscribe(err => {
        result = err;
        done();
      });

      component.changePassword({
        oldPassword,
        password
      });

      expect(result).toEqual(error);
    });
  });
});
