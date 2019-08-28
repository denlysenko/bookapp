import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { NgShadowModule } from 'nativescript-ngx-shadow';
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
    NgShadowModule,
    TNSFontIconModule
  ],
  declarations: [AppMenuComponent, UserMenuComponent, MainLayoutComponent],
  exports: [MainLayoutComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MainLayoutModule {}
