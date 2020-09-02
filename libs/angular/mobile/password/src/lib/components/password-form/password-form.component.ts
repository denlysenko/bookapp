import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { NsBaseForm } from '@bookapp/angular/base';
import { FeedbackPlatformService } from '@bookapp/angular/core';
import { PasswordForm } from '@bookapp/shared/interfaces';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import { getViewById } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'bookapp-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFormComponent extends NsBaseForm {
  source = {
    oldPassword: '',
    password: '',
  };

  @Input() loading: boolean;

  @Input()
  set error(error: any) {
    if (error) {
      this.handleError(error);
    }
  }

  @Output() formSubmitted = new EventEmitter<PasswordForm>();

  constructor(feedbackService: FeedbackPlatformService) {
    super(feedbackService);
  }

  async submit() {
    const valid = await this.dataForm.dataForm.validateAll();

    if (valid) {
      this.formSubmitted.emit(this.source);
    }
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(app.getRootView(), 'drawer') as RadSideDrawer;
    sideDrawer.toggleDrawerState();
  }
}
