import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';

import { AuthPageBase } from '@bookapp/angular/base';
import { ThemePlatformService } from '@bookapp/angular/core';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { Application, Color, isAndroid, Page } from '@nativescript/core';

import { AuthFormComponent } from '../../components/auth-form/auth-form.component';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const android: any;

@Component({
  imports: [NativeScriptCommonModule, AuthFormComponent],
  templateUrl: './auth-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class AuthPageComponent extends AuthPageBase implements OnInit {
  readonly #page = inject(Page);
  readonly #themeService = inject(ThemePlatformService);
  readonly #injector = inject(Injector);

  ngOnInit() {
    this.#page.actionBarHidden = true;

    if (isAndroid) {
      effect(
        () => {
          this.#setNavigationBarColor(this.#themeService.dark() ? '#121414' : '#EEEEEE');
        },
        { injector: this.#injector }
      );
    }
  }

  #setNavigationBarColor(color: string) {
    const activity = Application.android.startActivity || Application.android.foregroundActivity;

    if (activity) {
      const window = activity.getWindow();

      // Check if API level is 21 or higher (Lollipop)
      if (android.os.Build.VERSION.SDK_INT >= 21) {
        const androidColor = new Color(color).android;
        window.setNavigationBarColor(androidColor);
      }
    }
  }
}
