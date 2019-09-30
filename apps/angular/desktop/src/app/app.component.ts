import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'bookapp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // https://github.com/angular/angular/issues/29828#issuecomment-482913685
  constructor(router: Router) {
    router.initialNavigation();
  }
}
