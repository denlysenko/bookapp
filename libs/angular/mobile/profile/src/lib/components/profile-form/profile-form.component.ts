/* eslint-disable no-unused-private-class-members */
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  NO_ERRORS_SCHEMA,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { BaseForm } from '@bookapp/angular/base';
import { UploadPlatformService } from '@bookapp/angular/core';
import { ApiError, ProfileForm, User } from '@bookapp/shared/interfaces';

import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';
import { requestPermissions, takePicture } from '@nativescript/camera';
import { ImageAsset, ImageSource, isAndroid, isIOS, knownFolders, path } from '@nativescript/core';

import { ImageCropper } from 'nativescript-imagecropper';
import { map } from 'rxjs/operators';

interface Form {
  readonly firstName: FormControl<string>;
  readonly lastName: FormControl<string>;
  readonly email: FormControl<string>;
}

@Component({
  selector: 'bookapp-profile-form',
  imports: [NativeScriptCommonModule, NativeScriptFormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './profile-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProfileFormComponent extends BaseForm<Form> {
  readonly user = input<User>();
  readonly loading = input(false);
  readonly error = input<ApiError>();

  readonly formSubmitted = output<ProfileForm>();

  readonly #fb = inject(FormBuilder);
  readonly #uploadService = inject(UploadPlatformService);
  readonly #imageCropper = new ImageCropper();
  readonly #userEffect = effect(() => {
    const user = this.user();

    if (user) {
      this.form.patchValue(user);
    }
  });

  readonly #errorEffect = effect(() => {
    const error = this.error();

    if (error) {
      this.handleError(error);
    }
  });

  readonly form = this.#fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly progress$ = this.#uploadService.progress$;
  readonly submitting = signal(false);
  readonly uploading = signal(false);

  submit() {
    this.submitting.set(true);

    if (this.form.valid) {
      this.formSubmitted.emit({
        id: this.user().id,
        user: this.form.value,
      });
    }
  }

  async changeAvatar() {
    try {
      await requestPermissions();
    } catch {
      this.feedbackService.error('Permissions rejected');
      return;
    }

    let imageAsset: ImageAsset = null;

    try {
      imageAsset = await takePicture({
        width: 300,
        height: 300,
        keepAspectRatio: true,
      });
    } catch {
      return;
    }

    if (!imageAsset) {
      return;
    }

    let imageSource = null;

    try {
      imageSource = await ImageSource.fromAsset(imageAsset);
    } catch {
      return;
    }

    if (!imageSource) {
      return;
    }

    let cropped = null;

    try {
      cropped = await this.#imageCropper.show(imageSource, {
        width: 300,
        height: 300,
        lockSquare: true,
      });
    } catch {
      return;
    }

    if (!cropped || !cropped.image) {
      return;
    }

    const localPath = this.#getImageLocalPath(cropped.image);

    if (localPath) {
      this.uploading.set(true);
      this.#uploadService
        .upload(localPath)
        .pipe(map((res) => JSON.parse(res)))
        .subscribe({
          next: ({ publicUrl }) => {
            this.uploading.set(false);
            this.formSubmitted.emit({
              id: this.user().id,
              user: { avatar: publicUrl },
            });
          },
          error: ({ message }) => {
            this.uploading.set(false);
            this.handleError({ message });
          },
        });
    }
  }

  #getImageLocalPath(image: ImageSource): string {
    let localPath = null;

    if (isAndroid) {
      localPath = image.android;
    }

    if (isIOS) {
      const folder = knownFolders.documents();
      const filePath = path.join(folder.path, `avatar_for_ba_${new Date().getTime()}.png`);
      image.saveToFile(filePath, 'png');

      localPath = filePath;
    }

    return localPath;
  }
}
