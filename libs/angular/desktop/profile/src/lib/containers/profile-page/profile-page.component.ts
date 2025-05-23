import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

import { ProfilePageBase } from '@bookapp/angular/base';

import { AvatarSelectorComponent } from '../../components/avatar-selector/avatar-selector.component';
import { ProfileFormComponent } from '../../components/profile-form/profile-form.component';

@Component({
  imports: [AsyncPipe, MatCardModule, ProfileFormComponent, AvatarSelectorComponent],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent extends ProfilePageBase {}
