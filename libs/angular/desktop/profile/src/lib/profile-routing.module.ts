import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@bookapp/angular/shared';

import { ProfilePageComponent } from './containers/profile-page/profile-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProfilePageComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
