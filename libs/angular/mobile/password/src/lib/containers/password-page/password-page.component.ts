import { ChangeDetectionStrategy, Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { PasswordPageBase } from '@bookapp/angular/base';

import { Drawer } from '@nativescript-community/ui-drawer';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { Application, getViewById } from '@nativescript/core';

import { PasswordFormComponent } from '../../components/password-form/password-form.component';

@Component({
  imports: [NativeScriptCommonModule, PasswordFormComponent],
  templateUrl: './password-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class PasswordPageComponent extends PasswordPageBase {
  onDrawerButtonTap() {
    const sideDrawer = getViewById(Application.getRootView(), 'drawer') as Drawer;
    sideDrawer.toggle();
  }
}
