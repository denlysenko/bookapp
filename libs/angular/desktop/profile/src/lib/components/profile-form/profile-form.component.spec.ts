// tslint:disable: no-identical-functions

// tslint:disable: no-duplicate-string
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { MockFeedbackPlatformService, user } from '@bookapp/testing';

import { ProfileFormComponent } from './profile-form.component';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProfileFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: FeedbackPlatformService,
          useValue: MockFeedbackPlatformService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    component.user = user;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form', () => {
    expect(component.form.value).toMatchObject({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  });

  describe('Validations', () => {
    describe('firstName', () => {
      let firstNameField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        firstNameField = component.form.get('firstName');
        input = fixture.debugElement.query(
          By.css('input[formcontrolname=firstName]')
        ).nativeElement;
      });

      it('should have required error', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(firstNameField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(firstNameField.hasError('required')).toEqual(false);
      });
    });

    describe('lastName', () => {
      let lastNameField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        lastNameField = component.form.get('lastName');
        input = fixture.debugElement.query(
          By.css('input[formcontrolname=lastName]')
        ).nativeElement;
      });

      it('should have required error', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(lastNameField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(lastNameField.hasError('required')).toEqual(false);
      });
    });

    describe('email', () => {
      let emailNameField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        emailNameField = component.form.get('email');
        input = fixture.debugElement.query(
          By.css('input[formcontrolname=email]')
        ).nativeElement;
      });

      it('should have required error', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(emailNameField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(emailNameField.hasError('required')).toEqual(false);
      });

      it('should have email error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(emailNameField.hasError('email')).toEqual(true);
      });

      it('should not have email error', () => {
        input.value = 'test@test.com';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(emailNameField.hasError('email')).toEqual(false);
      });
    });
  });

  describe('submit()', () => {
    beforeEach(() => {
      jest.spyOn(component.formSubmitted, 'emit');
    });

    it('should not emit formSubmitted if form is invalid', () => {
      component.form.patchValue({ email: 'test' });
      component.submit();
      expect(component.formSubmitted.emit).not.toHaveBeenCalled();
    });

    it('should emit formSubmitted if form is valid', () => {
      const firstName = 'first name';
      const lastName = 'last name';

      component.form.patchValue({
        firstName,
        lastName
      });

      component.submit();

      expect(component.formSubmitted.emit).toHaveBeenCalledWith({
        id: user._id,
        user: {
          email: user.email,
          firstName,
          lastName
        }
      });
    });
  });
});
