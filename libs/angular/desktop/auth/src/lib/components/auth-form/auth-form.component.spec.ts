import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { MockFeedbackPlatformService } from '@bookapp/testing';

import { AuthFormComponent } from './auth-form.component';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AuthFormComponent],
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
    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form', () => {
    expect(component.form.value).toEqual({ email: null, password: null });
  });

  describe('toggleAuthMode()', () => {
    it('should toggle auth mode', () => {
      expect(component.isLoggingIn).toEqual(true);
      component.toggleAuthMode();
      expect(component.isLoggingIn).toEqual(false);
    });

    it('should enable fields in signup mode', () => {
      const firstNameField = component.form.get('firstName');
      const lastNameField = component.form.get('lastName');

      expect(firstNameField.enabled).toEqual(false);
      expect(lastNameField.enabled).toEqual(false);

      component.toggleAuthMode();

      expect(firstNameField.enabled).toEqual(true);
      expect(lastNameField.enabled).toEqual(true);
    });
  });

  describe('Validations', () => {
    describe('email', () => {
      let emailField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        emailField = component.form.get('email');
        input = fixture.debugElement.query(
          By.css('input[formcontrolname=email]')
        ).nativeElement;
      });

      it('should have required error', () => {
        expect(emailField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(emailField.hasError('required')).toEqual(false);
      });

      it('should have email error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(emailField.hasError('email')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test@test.com';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(emailField.hasError('email')).toEqual(false);
      });
    });

    describe('password', () => {
      let passwordField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        passwordField = component.form.get('password');
        input = fixture.debugElement.query(
          By.css('input[formcontrolname=password]')
        ).nativeElement;
      });

      it('should have required error', () => {
        expect(passwordField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(passwordField.hasError('required')).toEqual(false);
      });
    });

    describe('firstName', () => {
      let firstNameField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        component.toggleAuthMode();
        fixture.detectChanges();
        firstNameField = component.form.get('firstName');
        input = fixture.debugElement.query(
          By.css('input[formcontrolname=firstName]')
        ).nativeElement;
      });

      it('should have required error', () => {
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
        component.toggleAuthMode();
        fixture.detectChanges();
        lastNameField = component.form.get('lastName');
        input = fixture.debugElement.query(
          By.css('input[formcontrolname=lastName]')
        ).nativeElement;
      });

      it('should have required error', () => {
        expect(lastNameField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(lastNameField.hasError('required')).toEqual(false);
      });
    });
  });

  describe('submit()', () => {
    beforeEach(() => {
      jest.spyOn(component.formSubmitted, 'emit');
    });

    it('should not emit formSubmitted if form is invalid', () => {
      component.submit();
      expect(component.formSubmitted.emit).not.toHaveBeenCalled();
    });

    it('should emit formSubmitted if form is valid', () => {
      const formValue = { email: 'test@test.com', password: 'pass' };
      component.form.patchValue(formValue);
      component.submit();
      expect(component.formSubmitted.emit).toHaveBeenCalledWith({
        isLoggingIn: true,
        credentials: formValue
      });
    });
  });
});
