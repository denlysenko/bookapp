import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@bookapp/angular/shared';

import { PasswordPageComponent } from './containers/password-page/password-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PasswordPageComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class PasswordRoutingModule {}
