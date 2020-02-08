import { Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReadBookBase } from '@bookapp/angular/base';
import { ProfileService } from '@bookapp/angular/data-access';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { WebViewInterface } from 'nativescript-webview-interface';

import * as application from 'tns-core-modules/application';
import { EventData, getViewById } from 'tns-core-modules/ui/page/page';
import { WebView } from 'tns-core-modules/ui/web-view';

@Component({
  selector: 'bookapp-read-book-page',
  templateUrl: './read-book-page.component.html',
  styleUrls: ['./read-book-page.component.scss']
})
export class ReadBookPageComponent extends ReadBookBase implements OnDestroy {
  @ViewChild('epubWebView', { static: true })
  epubWebViewRef: ElementRef;

  private webViewInterface: WebViewInterface;

  constructor(
    route: ActivatedRoute,
    profileService: ProfileService,
    private readonly zone: NgZone
  ) {
    super(route, profileService);
  }

  onLoaded() {
    this.webViewInterface = new WebViewInterface(this.epubWebView, '~/assets/www/index.html');

    this.epubWebView.on('loadFinished', (args: EventData) => {
      const webview: WebView = args.object as WebView;

      if (webview.android) {
        this.epubWebView.android.getSettings().setAllowContentAccess(true);
        this.epubWebView.android.getSettings().setAllowFileAccess(true);
        this.epubWebView.android.getSettings().setJavaScriptEnabled(true);
        this.epubWebView.android.getSettings().setLoadsImagesAutomatically(true);
        this.epubWebView.android.getSettings().setAllowUniversalAccessFromFileURLs(true);
        this.epubWebView.android.getSettings().setBuiltInZoomControls(false);
        this.epubWebView.android.getSettings().setDisplayZoomControls(false);
      }

      this.webViewInterface.emit('loadBook', {
        src: this.epubUrl,
        bookmark: this.bookmark
      });
    });

    this.webViewInterface.on('locationChanged', (data: string) => {
      this.currentLocation = data;
    });

    application.on(application.suspendEvent, () => {
      // only need to save current page, which is happening in Base's OnDestroy
      this.zone.run(() => {
        super.ngOnDestroy();
      });
    });
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(application.getRootView(), 'drawer') as RadSideDrawer;
    sideDrawer.toggleDrawerState();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.webViewInterface.destroy();
    this.webViewInterface = null;
    application.off(application.suspendEvent);
  }

  private get epubWebView(): WebView {
    return this.epubWebViewRef.nativeElement;
  }
}
