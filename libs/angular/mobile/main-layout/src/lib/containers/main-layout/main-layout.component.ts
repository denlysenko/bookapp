import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  NO_ERRORS_SCHEMA,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { MainLayoutBase } from '@bookapp/angular/base';
import { ThemePlatformService } from '@bookapp/angular/core';
import { LogsService } from '@bookapp/angular/data-access';

import { Drawer } from '@nativescript-community/ui-drawer';
import { DrawerModule } from '@nativescript-community/ui-drawer/angular';

import { NativeScriptCommonModule, PageRouterOutlet } from '@nativescript/angular';
import { Application, Color, isAndroid, Page } from '@nativescript/core';

import { takeUntil } from 'rxjs/operators';

import { AppMenuComponent } from '../../components/app-menu/app-menu.component';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const android: any;

@Component({
  imports: [
    NativeScriptCommonModule,
    DrawerModule,
    PageRouterOutlet,
    AsyncPipe,
    NgClass,
    AppMenuComponent,
    UserMenuComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LogsService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MainLayoutComponent extends MainLayoutBase implements OnInit, AfterViewInit {
  readonly drawerComponent = viewChild<ElementRef>('drawer');

  readonly #router = inject(Router);
  readonly #page = inject(Page);
  readonly #themeService = inject(ThemePlatformService);
  readonly #injector = inject(Injector);
  #drawer: Drawer;

  readonly isUserMenuOpen = signal(false);

  ngOnInit() {
    this.#page.actionBarHidden = true;
    this.#router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd && this.#drawer) {
        this.#drawer.close();
      }
    });

    if (isAndroid) {
      effect(
        () => {
          this.#setNavigationBarColor(this.#themeService.dark() ? '#121414' : '#EEEEEE');
        },
        { injector: this.#injector }
      );
    }
  }

  ngAfterViewInit() {
    this.#drawer = this.drawerComponent()?.nativeElement;
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((open) => !open);
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
