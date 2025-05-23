import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { PageRouterOutlet } from '@nativescript/angular';

@Component({
  selector: 'bookapp-root',
  imports: [PageRouterOutlet],
  templateUrl: './app.component.html',
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppComponent {}
