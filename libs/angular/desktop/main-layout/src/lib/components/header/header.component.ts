import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

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

  readonly toggleSidenav = output<void>();
  readonly logout = output<void>();

  readonly title = 'Book App';
  readonly userMenu = userMenu;

  doToggleSidenav() {
    this.toggleSidenav.emit();
  }

  doLogout() {
    this.logout.emit();
  }
}
