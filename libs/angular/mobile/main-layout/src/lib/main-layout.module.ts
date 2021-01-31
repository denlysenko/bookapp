import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { DateToPeriodPipe } from '@bookapp/angular/shared';

import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';

import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';

import { AppMenuComponent } from './components/app-menu/app-menu.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { MainLayoutComponent } from './containers/main-layout/main-layout.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptUISideDrawerModule,
    CommonModule,
    TNSFontIconModule,
  ],
  declarations: [AppMenuComponent, UserMenuComponent, MainLayoutComponent, DateToPeriodPipe],
  exports: [MainLayoutComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MainLayoutModule {}
