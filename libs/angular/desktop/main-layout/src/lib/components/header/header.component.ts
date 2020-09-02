import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { userMenu } from '@bookapp/angular/shared';
import { User } from '@bookapp/shared/interfaces';

@Component({
  selector: 'bookapp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly title = 'Book App';
  readonly userMenu = userMenu;

  @Input() isMobile = false;
  @Input() user: User;

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  doToggleSidenav() {
    this.toggleSidenav.emit();
  }

  doLogout() {
    this.logout.emit();
  }
}
