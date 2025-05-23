import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { PasswordService } from '@bookapp/angular/data-access';
import { MockFeedbackPlatformService } from '@bookapp/testing/angular';

import { of } from 'rxjs';

import { PasswordPageComponent } from './password-page.component';

const password = 'newPassword';
const oldPassword = 'oldPassword';

describe('PasswordPageComponent', () => {
  let component: PasswordPageComponent;
  let fixture: ComponentFixture<PasswordPageComponent>;
  let passwordService: PasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PasswordPageComponent],
      providers: [
        {
          provide: PasswordService,
          useValue: {
            changePassword: jest
              .fn()
              .mockImplementation(() => of({ data: { changePassword: true } })),
          },
        },
        {
          provide: FeedbackPlatformService,
          useValue: MockFeedbackPlatformService,
        },
      ],
    }).compileComponents();

    passwordService = TestBed.inject(PasswordService);
  });

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
      expect(passwordService.changePassword).toHaveBeenCalledWith(password, oldPassword);
    });

    it('should propagate error', async () => {
      const error = { message: 'Error' };

      jest
        .spyOn(passwordService, 'changePassword')
        .mockImplementationOnce(() => of({ errors: [error] }));

      component.changePassword({
        oldPassword,
        password,
      });
      await fixture.whenStable();

      expect(component.error()).toEqual(error);
    });
  });
});
