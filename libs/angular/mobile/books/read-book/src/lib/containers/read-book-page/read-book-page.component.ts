import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  viewChild,
} from '@angular/core';

import { ReadBookBase } from '@bookapp/angular/base';

import { Drawer } from '@nativescript-community/ui-drawer';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { Application, getViewById, LoadEventData, WebView } from '@nativescript/core';

import { WebViewInterface } from 'nativescript-webview-interface';

@Component({
  imports: [NativeScriptCommonModule],
  host: {
    '(unloaded)': 'onUnloaded()',
  },
  templateUrl: './read-book-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class ReadBookPageComponent extends ReadBookBase implements OnDestroy {
  readonly epubWebViewRef = viewChild<ElementRef>('epubWebView');

  readonly #ngZone = inject(NgZone);
  #webViewInterface: WebViewInterface;

  onLoaded() {
    this.#webViewInterface = new WebViewInterface(this.#epubWebView, '~/assets/www/index.html');

    this.#epubWebView.on('loadFinished', (args: LoadEventData) => {
      const webview = args.object as WebView;

      if (webview.android) {
        this.#epubWebView.android.getSettings().setAllowContentAccess(true);
        this.#epubWebView.android.getSettings().setAllowFileAccess(true);
        this.#epubWebView.android.getSettings().setJavaScriptEnabled(true);
        this.#epubWebView.android.getSettings().setLoadsImagesAutomatically(true);
        this.#epubWebView.android.getSettings().setAllowUniversalAccessFromFileURLs(true);
        this.#epubWebView.android.getSettings().setBuiltInZoomControls(false);
        this.#epubWebView.android.getSettings().setDisplayZoomControls(false);
      }

      this.#webViewInterface.emit('loadBook', {
        src: this.epubUrl,
        bookmark: this.bookmark,
      });
    });

    this.#webViewInterface.on('locationChanged', (data: string) => {
      this.currentLocation.set(data);
    });

    Application.on(Application.suspendEvent, () => {
      // only need to save current page, which is happening in Base's OnDestroy
      this.#ngZone.run(() => {
        super.ngOnDestroy();
      });
    });
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(Application.getRootView(), 'drawer') as Drawer;
    sideDrawer.toggle();
  }

  onUnloaded() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.#webViewInterface.destroy();
    this.#webViewInterface = null;
    Application.off(Application.suspendEvent);
  }

  get #epubWebView(): WebView {
    return this.epubWebViewRef().nativeElement;
  }
}
