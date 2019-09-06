import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { ProfilePageComponent } from './containers/profile-page/profile-page.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [CommonModule, ProfileRoutingModule],
  declarations: [ProfileFormComponent, ProfilePageComponent]
})
export class ProfileModule {}
