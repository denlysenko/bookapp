import { Button, isIOS } from '@nativescript/core';

export class PlainButton extends Button {
  createNativeView() {
    if (isIOS) {
      return UIButton.buttonWithType(UIButtonType.Custom);
    }

    return super.createNativeView();
  }
}
