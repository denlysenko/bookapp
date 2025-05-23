/* eslint-disable no-unused-private-class-members */
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  NO_ERRORS_SCHEMA,
} from '@angular/core';

import { ProfilePageBase } from '@bookapp/angular/base';
import { LoaderPlatformService } from '@bookapp/angular/core';

import { Drawer } from '@nativescript-community/ui-drawer';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { Application, getViewById } from '@nativescript/core';

import { ProfileFormComponent } from '../../components/profile-form/profile-form.component';

@Component({
  imports: [NativeScriptCommonModule, AsyncPipe, ProfileFormComponent],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProfilePageComponent extends ProfilePageBase {
  readonly #loaderService = inject(LoaderPlatformService);
  readonly #loadingEffect = effect(() => {
    if (this.loading()) {
      this.#loaderService.start();
    } else {
      this.#loaderService.stop();
    }
  });

  onDrawerButtonTap() {
    const sideDrawer = getViewById(Application.getRootView(), 'drawer') as Drawer;
    sideDrawer.toggle();
  }
}
