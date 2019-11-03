import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PasswordPageComponent } from './containers/password-page/password-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PasswordPageComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class PasswordRoutingModule {}
