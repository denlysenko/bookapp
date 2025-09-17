import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Passkey, PasskeyProvidersMetadata } from '@bookapp/shared/interfaces';

@Component({
  selector: 'bookapp-passkey',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, DatePipe],
  templateUrl: './passkey.component.html',
  styleUrls: ['./passkey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasskeyComponent {
  readonly passkey = input.required<Passkey>();
  readonly passkeyProvidersMetadata = input<Record<string, PasskeyProvidersMetadata>>();
  readonly loading = input(false);

  readonly editPasskey = output<Passkey>();
  readonly deletePasskey = output<Passkey>();
}
