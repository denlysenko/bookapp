import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';

import { ImageSelectorComponent } from '@bookapp/angular/ui-desktop';
import { ProfileForm, User } from '@bookapp/shared/interfaces';

@Component({
  selector: 'bookapp-avatar-selector',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarSelectorComponent {
  readonly user = input<User>();

  readonly avatarSaved = output<ProfileForm>();

  readonly #dialog = inject(MatDialog);

  showSelector() {
    const dialogRef = this.#dialog.open(ImageSelectorComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((avatar) => {
      if (avatar) {
        this.avatarSaved.emit({ id: this.user().id, user: { avatar } });
      }
    });
  }
}
