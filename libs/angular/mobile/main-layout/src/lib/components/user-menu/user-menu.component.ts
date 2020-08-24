import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { userMenu } from '@bookapp/angular/shared';

@Component({
  moduleId: module.id,
  selector: 'bookapp-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  readonly userMenu = userMenu;

  @Output()
  logout = new EventEmitter<void>();
}
