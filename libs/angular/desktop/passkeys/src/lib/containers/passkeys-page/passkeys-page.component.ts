import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';

import { FeedbackPlatformService, WebauthnService } from '@bookapp/angular/core';
import { PasskeysService } from '@bookapp/angular/data-access';
import { ConfirmDialogComponent } from '@bookapp/angular/ui-desktop';
import { Passkey, PasskeyProvidersMetadata } from '@bookapp/shared/interfaces';

import { catchError, from, map, of, switchMap, tap } from 'rxjs';

import { EditPasskeyComponent } from '../../components/edit-passkey/edit-passkey.component';
import { PasskeyComponent } from '../../components/passkey/passkey.component';

@Component({
  imports: [AsyncPipe, MatCardModule, MatButtonModule, PasskeyComponent],
  templateUrl: './passkeys-page.component.html',
  styleUrl: './passkeys-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasskeysPageComponent {
  readonly #webauthnService = inject(WebauthnService);
  readonly #passkeysService = inject(PasskeysService);
  readonly #feedbackService = inject(FeedbackPlatformService);
  readonly #httpClient = inject(HttpClient);
  readonly #dialog = inject(MatDialog);

  readonly loading = signal(false);
  readonly isSupported = this.#webauthnService.isSupported;

  readonly passkeys$ = this.#passkeysService.watchPasskeys().pipe(map(({ data }) => data.passkeys));
  readonly passkeyProvidersMetadata$ = this.#httpClient
    .get<Record<string, PasskeyProvidersMetadata>>('/assets/aaguids.json')
    .pipe(catchError(() => of(null)));

  addPasskey() {
    this.loading.set(true);

    this.#passkeysService
      .startRegistration()
      .pipe(
        switchMap((options) => from(this.#webauthnService.createCredentials(options))),
        switchMap((credentials) => this.#passkeysService.verifyRegistration(credentials))
      )
      .subscribe({
        next: ({ data, errors }) => {
          this.loading.set(false);

          if (data) {
            this.#feedbackService.success('Passkey created');
          }

          if (errors) {
            this.#feedbackService.error(errors[errors.length - 1].message);
          }
        },
        error: () => {
          this.loading.set(false);
          this.#feedbackService.error('Error adding passkey');
        },
      });
  }

  deletePasskey(passkey: Passkey) {
    const dialogRef = this.#dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        text: `Are you sure you want to delete passkey ${passkey.label}?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result: boolean) => {
          if (result) {
            this.loading.set(true);

            return this.#passkeysService.deletePasskey(passkey.id).pipe(
              tap(({ data, errors }) => {
                this.loading.set(false);

                if (data) {
                  this.#feedbackService.success('Passkey deleted');
                }

                if (errors) {
                  this.#feedbackService.error(errors[errors.length - 1].message);
                }
              })
            );
          }

          return of(false);
        })
      )
      .subscribe();
  }

  editPasskey(passkey: Passkey) {
    const dialogRef = this.#dialog.open(EditPasskeyComponent, {
      width: '300px',
      data: {
        passkey,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            this.loading.set(true);

            return this.#passkeysService.updatePasskey(passkey.id, result.label).pipe(
              tap(({ data, errors }) => {
                this.loading.set(false);

                if (data) {
                  this.#feedbackService.success('Passkey updated');
                }

                if (errors) {
                  this.#feedbackService.error(errors[errors.length - 1].message);
                }
              })
            );
          }

          return of(false);
        })
      )
      .subscribe();
  }
}
