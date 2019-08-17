import { LocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router, UrlTree } from '@angular/router';

interface ExtendedNavigationExtras extends NavigationExtras {
  // Options for nativescript
  clearHistory?: boolean;
  animated?: boolean;
  transition?: {
    // See -> https://docs.nativescript.org/api-reference/interfaces/_ui_frame_.navigationtransition.html
    name?: string;
    instance?: any;
    duration?: number;
    curve?: any;
  };
  // END - Options for nativescript
}

@Injectable()
export class RouterExtensions {
  constructor(
    public router: Router,
    private locationStrategy: LocationStrategy
  ) {}

  navigate(
    commands: any[],
    extras?: ExtendedNavigationExtras
  ): Promise<boolean> {
    return this.router.navigate(commands, extras);
  }

  navigateByUrl(
    url: string | UrlTree,
    options?: ExtendedNavigationExtras
  ): Promise<boolean> {
    return this.router.navigateByUrl(url, options);
  }

  back() {
    this.locationStrategy.back();
  }
}
