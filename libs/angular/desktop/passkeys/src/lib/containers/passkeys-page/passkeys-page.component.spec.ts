import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FeedbackPlatformService, WebauthnService } from '@bookapp/angular/core';
import { PasskeysService } from '@bookapp/angular/data-access';
import { PasskeyProvidersMetadata } from '@bookapp/shared/interfaces';
import {
  authenticationOptions,
  clickOnBtn,
  MockFeedbackPlatformService,
  passkey,
} from '@bookapp/testing/angular';

import { of, throwError } from 'rxjs';

import { PasskeysPageComponent } from './passkeys-page.component';

const mockPasskeys = {
  count: 2,
  rows: [
    {
      ...passkey,
      id: '1',
      label: 'First Passkey',
      userId: 'user-1',
      deviceType: 'single_device',
      backedUp: false,
      aaguid: 'test-aaguid',
      lastUsedAt: Date.now(),
      publicKey: new Uint8Array([1, 2, 3]),
    },
    {
      ...passkey,
      id: '2',
      label: 'Second Passkey',
      userId: 'user-1',
      deviceType: 'multi_device',
      backedUp: true,
      aaguid: 'test-aaguid',
      lastUsedAt: Date.now(),
      publicKey: new Uint8Array([4, 5, 6]),
    },
  ],
};

const mockProvidersMetadata: Record<string, PasskeyProvidersMetadata> = {
  'test-aaguid': {
    name: 'Test Provider',
    icon_light: '/assets/test-icon-light.png',
    icon_dark: '/assets/test-icon-dark.png',
  },
};

const mockCredentials = {
  id: 'credential-id',
  rawId: 'credential-id',
  response: {
    clientDataJSON: 'client-data',
    attestationObject: 'attestation-object',
  },
  type: 'public-key',
};

describe('PasskeysPageComponent', () => {
  let component: PasskeysPageComponent;
  let fixture: ComponentFixture<PasskeysPageComponent>;
  let passkeysService: PasskeysService;
  let webauthnService: WebauthnService;
  let httpClient: HttpClient;
  let feedbackService: FeedbackPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PasskeysPageComponent, NoopAnimationsModule],
      providers: [
        {
          provide: PasskeysService,
          useValue: {
            watchPasskeys: jest.fn().mockReturnValue(of({ data: { passkeys: mockPasskeys } })),
            startRegistration: jest.fn().mockReturnValue(of(authenticationOptions)),
            verifyRegistration: jest
              .fn()
              .mockReturnValue(of({ data: { verifyRegistration: passkey } })),
            deletePasskey: jest.fn().mockReturnValue(of({ data: { deletePasskey: true } })),
            updatePasskey: jest.fn().mockReturnValue(of({ data: { editPasskey: passkey } })),
          },
        },
        {
          provide: WebauthnService,
          useValue: {
            isSupported: true,
            createCredentials: jest.fn().mockResolvedValue(mockCredentials),
          },
        },
        {
          provide: HttpClient,
          useValue: {
            get: jest.fn().mockReturnValue(of(mockProvidersMetadata)),
          },
        },
        {
          provide: FeedbackPlatformService,
          useValue: MockFeedbackPlatformService,
        },
        MatDialog,
      ],
    }).compileComponents();

    passkeysService = TestBed.inject(PasskeysService);
    webauthnService = TestBed.inject(WebauthnService);
    httpClient = TestBed.inject(HttpClient);
    feedbackService = TestBed.inject(FeedbackPlatformService);

    fixture = TestBed.createComponent(PasskeysPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load passkeys on init', (done) => {
    expect(passkeysService.watchPasskeys).toHaveBeenCalled();
    component.passkeys$.subscribe((passkeys) => {
      expect(passkeys).toEqual(mockPasskeys);
      done();
    });
  });

  it('should load provider metadata on init', (done) => {
    expect(httpClient.get).toHaveBeenCalledWith('/assets/aaguids.json');
    component.passkeyProvidersMetadata$.subscribe((metadata) => {
      expect(metadata).toEqual(mockProvidersMetadata);
      done();
    });
  });

  it('should show unsupported message when webauthn is not supported', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (webauthnService.isSupported as any) = false;

    const newFixture = TestBed.createComponent(PasskeysPageComponent);
    newFixture.detectChanges();

    const unsupportedMessage = newFixture.nativeElement.querySelector('p');
    expect(unsupportedMessage?.textContent).toContain('Your browser does not support passkeys');
  });

  it('should display add button when webauthn is supported', () => {
    const addButton = fixture.nativeElement.querySelector('[data-test="save"]');
    expect(addButton).toBeTruthy();
    expect(addButton.textContent.trim()).toBe('Add');
  });

  it('should not display add button when webauthn is not supported', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (webauthnService.isSupported as any) = false;

    const newFixture = TestBed.createComponent(PasskeysPageComponent);
    newFixture.detectChanges();

    const addButton = newFixture.nativeElement.querySelector('[data-test="save"]');
    expect(addButton).toBeFalsy();
  });

  describe('addPasskey()', () => {
    it('should add passkey successfully', async () => {
      clickOnBtn(fixture, '[data-test="save"]');
      await fixture.whenStable();

      expect(passkeysService.startRegistration).toHaveBeenCalled();
      expect(webauthnService.createCredentials).toHaveBeenCalledWith(authenticationOptions);
      expect(passkeysService.verifyRegistration).toHaveBeenCalledWith(mockCredentials);
      expect(feedbackService.success).toHaveBeenCalledWith('Passkey added successfully');
    });

    it('should handle registration start error', async () => {
      (passkeysService.startRegistration as jest.Mock).mockReturnValue(
        throwError(() => new Error('Registration failed'))
      );

      clickOnBtn(fixture, '[data-test="save"]');
      await fixture.whenStable();

      expect(feedbackService.error).toHaveBeenCalledWith('Error adding passkey');
    });

    it('should handle webauthn credentials creation error', async () => {
      (webauthnService.createCredentials as jest.Mock).mockRejectedValue(
        new Error('WebAuthn failed')
      );

      clickOnBtn(fixture, '[data-test="save"]');
      await fixture.whenStable();

      expect(feedbackService.error).toHaveBeenCalledWith('Error adding passkey');
    });

    it('should handle API errors in response', async () => {
      const errorMessage = 'API validation error';
      (passkeysService.verifyRegistration as jest.Mock).mockReturnValue(
        of({ errors: [{ message: errorMessage }] })
      );

      clickOnBtn(fixture, '[data-test="save"]');
      await fixture.whenStable();

      expect(feedbackService.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('deletePasskey()', () => {
    it('should delete passkey when confirmed through dialog interaction', async () => {
      const deleteButton = fixture.nativeElement.querySelector('[data-test="delete"]');
      deleteButton.click();
      fixture.detectChanges();
      const confirmDialog = document.querySelector('mat-dialog-container');
      expect(confirmDialog).toBeTruthy();
      const confirmButton = confirmDialog.querySelector('#confirm-btn') as HTMLButtonElement;
      expect(confirmButton).toBeTruthy();
      confirmButton.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(passkeysService.deletePasskey).toHaveBeenCalledWith('1');
      expect(feedbackService.success).toHaveBeenCalledWith('Passkey deleted');
    });

    it('should not delete passkey when cancelled through dialog interaction', async () => {
      const deleteButton = fixture.nativeElement.querySelector('[data-test="delete"]');
      deleteButton.click();
      fixture.detectChanges();
      const confirmDialog = document.querySelector('mat-dialog-container');
      expect(confirmDialog).toBeTruthy();
      const cancelButton = confirmDialog.querySelector('#cancel-btn') as HTMLButtonElement;
      expect(cancelButton).toBeTruthy();
      cancelButton.click();
      fixture.detectChanges();

      expect(passkeysService.deletePasskey).not.toHaveBeenCalled();
      expect(feedbackService.success).not.toHaveBeenCalled();
    });

    it('should handle delete errors', async () => {
      (passkeysService.deletePasskey as jest.Mock).mockReturnValue(
        of({ errors: [{ message: 'Delete failed' }] })
      );

      const deleteButton = fixture.nativeElement.querySelector('[data-test="delete"]');
      deleteButton.click();
      fixture.detectChanges();
      const confirmDialog = document.querySelector('mat-dialog-container');
      expect(confirmDialog).toBeTruthy();
      const confirmButton = confirmDialog.querySelector('#confirm-btn') as HTMLButtonElement;
      confirmButton.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(feedbackService.error).toHaveBeenCalledWith('Delete failed');
    });
  });

  describe('editPasskey()', () => {
    it('should update passkey when edit is submitted through dialog interaction', async () => {
      const newLabel = 'Updated Label';
      const editButton = fixture.nativeElement.querySelector('[data-test="edit"]');
      expect(editButton).toBeTruthy();
      editButton.click();
      fixture.detectChanges();
      const editDialog = document.querySelector('mat-dialog-container');
      expect(editDialog).toBeTruthy();

      const labelInput = editDialog.querySelector(
        'input[formControlName="label"]'
      ) as HTMLInputElement;
      expect(labelInput).toBeTruthy();
      expect(labelInput.value).toBe('First Passkey');

      labelInput.value = newLabel;
      labelInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const saveButton = editDialog.querySelector('#save-btn') as HTMLButtonElement;
      expect(saveButton).toBeTruthy();
      saveButton.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(passkeysService.updatePasskey).toHaveBeenCalledWith('1', newLabel);
      expect(feedbackService.success).toHaveBeenCalledWith('Passkey updated');
    });

    it('should not update passkey when edit is cancelled through dialog interaction', async () => {
      const editButton = fixture.nativeElement.querySelector('[data-test="edit"]');
      editButton.click();
      fixture.detectChanges();
      const editDialog = document.querySelector('mat-dialog-container');
      expect(editDialog).toBeTruthy();
      const cancelButton = editDialog.querySelector('#cancel-btn') as HTMLButtonElement;
      expect(cancelButton).toBeTruthy();
      cancelButton.click();
      fixture.detectChanges();

      expect(passkeysService.updatePasskey).not.toHaveBeenCalled();
      expect(feedbackService.success).not.toHaveBeenCalled();
    });

    it('should handle update errors', async () => {
      const newLabel = 'Updated Label';
      (passkeysService.updatePasskey as jest.Mock).mockReturnValue(
        of({ errors: [{ message: 'Update failed' }] })
      );

      const editButton = fixture.nativeElement.querySelector('[data-test="edit"]');
      editButton.click();
      await fixture.whenStable();
      fixture.detectChanges();
      const editDialog = document.querySelector('mat-dialog-container');
      const labelInput = editDialog?.querySelector(
        'input[formControlName="label"]'
      ) as HTMLInputElement;
      labelInput.value = newLabel;
      labelInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const saveButton = editDialog?.querySelector('#save-btn') as HTMLButtonElement;
      saveButton.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(feedbackService.error).toHaveBeenCalledWith('Update failed');
    });
  });
});
