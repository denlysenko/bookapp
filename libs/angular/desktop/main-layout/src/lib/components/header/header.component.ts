import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeMode } from '@bookapp/angular/core';
import { userMenu } from '@bookapp/shared/constants';
import { User } from '@bookapp/shared/interfaces';

@Component({
  selector: 'bookapp-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly isMobile = input(false);
  readonly user = input<User>();
  readonly themeMode = input<ThemeMode>();

  readonly toggleSidenav = output<void>();
  readonly toggleMode = output<ThemeMode>();
  readonly logout = output<void>();

  readonly title = 'Book App';
  // TODO: move passkey to constants in case they will be available in the mobile app
  readonly userMenu = [
    ...userMenu,
    {
      label: 'Passkeys',
      path: 'passkeys',
      icon: 'key',
    },
  ];

  doToggleSidenav() {
    this.toggleSidenav.emit();
  }

  doLogout() {
    this.logout.emit();
  }
}
