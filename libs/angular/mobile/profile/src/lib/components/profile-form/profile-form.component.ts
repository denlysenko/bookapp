import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { NsBaseForm } from '@bookapp/angular/base';
import { FeedbackPlatformService, UploadPlatformService } from '@bookapp/angular/core';
import { ProfileForm, User } from '@bookapp/shared';

import { requestPermissions, takePicture } from 'nativescript-camera';
import { ImageCropper } from 'nativescript-imagecropper';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as app from 'tns-core-modules/application';
import { knownFolders, path } from 'tns-core-modules/file-system';
import { ImageSource } from 'tns-core-modules/image-source';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { getViewById } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'bookapp-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFormComponent extends NsBaseForm {
  progress$ = this.uploadService.progress$;

  @Input() loading: boolean;

  @Input()
  set user(user: Partial<User>) {
    if (user) {
      this._user = user;
      this.source.next({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  }
  get user(): Partial<User> {
    return this._user;
  }

  @Input()
  set error(error: any) {
    if (error) {
      this.handleError(error);
    }
  }

  @Output() formSubmitted = new EventEmitter<ProfileForm>();

  private imageCropper = new ImageCropper();
  private _user: Partial<User>;
  private uploading = new BehaviorSubject<boolean>(false);
  private source = new BehaviorSubject<Partial<User>>({
    firstName: '',
    lastName: '',
    email: ''
  });

  constructor(
    feedbackService: FeedbackPlatformService,
    private readonly uploadService: UploadPlatformService
  ) {
    super(feedbackService);
  }

  get source$(): Observable<Partial<User>> {
    return this.source.asObservable();
  }

  get uploading$(): Observable<boolean> {
    return this.uploading.asObservable();
  }

  async submit() {
    const valid = await this.dataForm.dataForm.validateAll();

    if (valid) {
      this.formSubmitted.emit({
        id: this.user._id,
        user: this.source.getValue()
      });
    }
  }

  async changeAvatar() {
    try {
      await requestPermissions();
    } catch (err) {
      this.feedbackService.error('Permissions rejected');
      return;
    }

    let imageAsset: any = null;

    try {
      imageAsset = await takePicture({
        width: 300,
        height: 300,
        keepAspectRatio: true
      });
    } catch (err) {}

    if (!imageAsset) {
      return;
    }

    let imageSource = null;

    try {
      imageSource = await new ImageSource().fromAsset(imageAsset);
    } catch (err) {}

    if (!imageSource) {
      return;
    }

    let cropped = null;

    try {
      cropped = await this.imageCropper.show(imageSource, {
        width: 300,
        height: 300,
        lockSquare: true
      });
    } catch (err) {}

    if (!cropped || !cropped.image) {
      return;
    }

    const localPath = this.getImageLocalPath(cropped.image);

    if (localPath) {
      this.uploading.next(true);
      this.uploadService
        .upload(localPath)
        .pipe(map(res => JSON.parse(res)))
        .subscribe(
          ({ publicUrl }) => {
            this.uploading.next(false);
            this.formSubmitted.emit({
              id: this.user._id,
              user: { avatar: publicUrl }
            });
          },
          ({ message }) => {
            this.uploading.next(false);
            this.handleError({ message: { message } });
          }
        );
    }
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(app.getRootView(), 'drawer') as RadSideDrawer;
    sideDrawer.toggleDrawerState();
  }

  private getImageLocalPath(image: ImageSource): string {
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
