import { Injectable } from '@angular/core';

import {
  browserSupportsWebAuthn,
  PublicKeyCredentialCreationOptionsJSON as CreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON as RequestOptionsJSON,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

@Injectable({ providedIn: 'root' })
export class WebauthnService {
  readonly isSupported = browserSupportsWebAuthn();

  async createCredentials(options: PublicKeyCredentialCreationOptionsJSON) {
    const optionsJSON = options as CreationOptionsJSON;
    return startRegistration({ optionsJSON });
  }

  getCredentials(options: PublicKeyCredentialRequestOptionsJSON) {
    const optionsJSON = options as RequestOptionsJSON;
    return startAuthentication({ optionsJSON });
  }
}
