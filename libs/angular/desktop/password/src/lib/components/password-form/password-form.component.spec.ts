import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { MockFeedbackPlatformService } from '@bookapp/testing/angular';

import { PasswordFormComponent } from './password-form.component';

describe('PasswordFormComponent', () => {
  let component: PasswordFormComponent;
  let fixture: ComponentFixture<PasswordFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PasswordFormComponent],
      providers: [
        {
          provide: FeedbackPlatformService,
          useValue: MockFeedbackPlatformService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form', () => {
    expect(component.form.value).toEqual({
      oldPassword: '',
      password: '',
    });
  });

  describe('Validations', () => {
    describe('oldPassword', () => {
      let oldPasswordField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        oldPasswordField = component.form.get('oldPassword');
        input = fixture.debugElement.query(
          By.css('input[formcontrolname=oldPassword]')
        ).nativeElement;
      });

      it('should have required error', () => {
        expect(oldPasswordField.hasError('required')).toEqual(true);
      });

      it('should not have required error', () => {
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(oldPasswordField.hasError('required')).toEqual(false);
      });
    });

    describe('newPassword', () => {
      let passwordField: AbstractControl;
      let input: HTMLInputElement;

      beforeEach(() => {
        passwordField = component.form.get('password');
        input = fixture.debugElement.query(By.css('input[formcontrolname=password]')).nativeElement;
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
      const formValue = {
        oldPassword: 'oldPassword',
        password: 'newPassword',
      };
      component.form.patchValue(formValue);
      component.submit();
      expect(component.formSubmitted.emit).toHaveBeenCalledWith(formValue);
    });
  });
});
