import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ImageSelectorComponent } from '@bookapp/angular/ui';
import { ProfileForm, User } from '@bookapp/shared';

@Component({
  selector: 'bookapp-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarSelectorComponent {
  @Input() user: User;

  @Output() avatarSaved = new EventEmitter<ProfileForm>();

  constructor(private readonly dialog: MatDialog) {}

  showSelector() {
    const dialogRef = this.dialog.open(ImageSelectorComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(avatar => {
      if (avatar) {
        this.avatarSaved.emit({ id: this.user._id, user: { avatar } });
      }
    });
  }
}
