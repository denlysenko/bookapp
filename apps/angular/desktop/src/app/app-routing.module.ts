import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthPageComponent } from '@bookapp/angular/desktop/auth';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'auth',
          component: AuthPageComponent
        }
      ],
      { initialNavigation: 'enabled' }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
