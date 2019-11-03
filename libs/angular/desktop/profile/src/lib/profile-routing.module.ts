import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProfilePageComponent } from './containers/profile-page/profile-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProfilePageComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
