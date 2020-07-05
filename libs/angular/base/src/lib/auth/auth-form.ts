import { ChangeDetectorRef, EventEmitter, Input, OnInit, Output, Directive } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { SignupCredentials } from '@bookapp/shared';

import { BaseForm } from '../core/base-form';

@Directive()
export abstract class AuthFormBase extends BaseForm implements OnInit {
  isLoggingIn = true;

  @Input() loading: boolean;

  @Input()
  set error(error: any) {
    if (error) {
      this.handleError(error);
    }
  }

  @Output() formSubmitted = new EventEmitter<{
    isLoggingIn: boolean;
    credentials: Partial<SignupCredentials>;
  }>();

  constructor(
    feedbackService: FeedbackPlatformService,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(feedbackService);
  }

  private firstNameField: AbstractControl;
  private lastNameField: AbstractControl;

  ngOnInit() {
    this.initForm();
  }

  toggleAuthMode() {
    this.isLoggingIn = !this.isLoggingIn;
    this.isLoggingIn ? this.disableFields() : this.enableFields();
    this.cdr.markForCheck();
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit({
        credentials: this.form.value,
        isLoggingIn: this.isLoggingIn
      });
    }
  }

  private initForm() {
    this.form = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });

    this.firstNameField = this.form.get('firstName');
    this.lastNameField = this.form.get('lastName');
    this.disableFields();
  }

  private enableFields() {
    this.firstNameField.enable();
    this.lastNameField.enable();
  }

  private disableFields() {
    this.firstNameField.disable();
    this.lastNameField.disable();
  }
}
