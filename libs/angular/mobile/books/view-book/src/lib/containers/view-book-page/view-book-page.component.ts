import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { ViewBookPageBase } from '@bookapp/angular/base';
import { LoaderPlatformService, RouterExtensions } from '@bookapp/angular/core';
import { BookmarksService, BookService } from '@bookapp/angular/data-access';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { Application, Color, isAndroid } from '@nativescript/core';

import { takeUntil } from 'rxjs';
import { BookCommentsComponent } from '../../components/book-comments/book-comments.component';
import { BookDetailsComponent } from '../../components/book-details/book-details.component';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const android: any;

@Component({
  imports: [NativeScriptCommonModule, AsyncPipe, BookDetailsComponent, BookCommentsComponent],
  templateUrl: './view-book-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BookmarksService, BookService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ViewBookPageComponent extends ViewBookPageBase implements OnInit, OnDestroy {
  readonly #routerExtensions = inject(RouterExtensions);
  readonly #loaderService = inject(LoaderPlatformService);

  ngOnInit() {
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.#loaderService.start() : this.#loaderService.stop()));

    if (isAndroid) {
      this.#setNavigationBarColor('#2f364a');
    }
  }

  ngOnDestroy(): void {
    if (isAndroid) {
      this.#setNavigationBarColor('#EEEEEE');
    }
  }

  onBackButtonTap() {
    this.#routerExtensions.back();
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
