import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ImageSelectorModule } from '@bookapp/angular/ui-desktop';

import { AvatarSelectorComponent } from './components/avatar-selector/avatar-selector.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { ProfilePageComponent } from './containers/profile-page/profile-page.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ImageSelectorModule
  ],
  declarations: [
    ProfileFormComponent,
    ProfilePageComponent,
    AvatarSelectorComponent
  ]
})
export class ProfileModule {}
