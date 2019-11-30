import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { MainLayoutBase } from '@bookapp/angular/base';
import { AuthService, LogsService } from '@bookapp/angular/data-access';

import { DrawerTransitionBase, SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';
import { RadSideDrawerComponent, SideDrawerType } from 'nativescript-ui-sidedrawer/angular';

import { takeUntil } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'bookapp-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  animations: [
    trigger('state', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      state('out', style({ opacity: 0, transform: 'translateY(-100%)' })),
      transition('in <=> out', [animate('300ms ease-out')])
    ])
  ]
})
export class MainLayoutComponent extends MainLayoutBase implements AfterViewInit {
  isUserMenuOpen = false;

  @ViewChild('drawer', { static: false })
  drawerComponent: RadSideDrawerComponent;

  private _sideDrawerTransition: DrawerTransitionBase;
  private drawer: SideDrawerType;

  constructor(authService: AuthService, logsService: LogsService, private readonly router: Router) {
    super(authService, logsService);
    this._sideDrawerTransition = new SlideInOnTopTransition();
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(e => {
      if (e instanceof NavigationEnd && this.drawer) {
        this.drawer.closeDrawer();
      }
    });
  }

  ngAfterViewInit() {
    this.drawer = this.drawerComponent.sideDrawer;
  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }
}
