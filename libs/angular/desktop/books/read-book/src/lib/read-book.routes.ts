import { Routes } from '@angular/router';

import { readBookResolver } from '@bookapp/angular/data-access';

import { ReadBookPageComponent } from './containers/read-book-page/read-book-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ReadBookPageComponent,
    resolve: {
      reading: readBookResolver,
    },
  },
];
