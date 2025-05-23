import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BookDetailsBase } from '@bookapp/angular/base';
import { RatingComponent } from '@bookapp/angular/ui-desktop';
import { ROLES } from '@bookapp/shared/enums';
import { Book, User } from '@bookapp/shared/interfaces';

@Component({
  selector: 'bookapp-book-details',
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    RouterLink,
    CurrencyPipe,
    RatingComponent,
  ],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent extends BookDetailsBase {
  readonly user = input<User>();
  readonly paymentRequested = output<Book>();
  readonly isAdmin = computed(() => this.user()?.roles.includes(ROLES.ADMIN));
}
