import { NgModule } from '@angular/core';

import { AuthService } from './services/auth/auth.service';
import { PasswordService } from './services/password/password.service';
import { ProfileService } from './services/profile/profile.service';

@NgModule({
  providers: [AuthService, PasswordService, ProfileService]
})
export class DataAccessModule {}
