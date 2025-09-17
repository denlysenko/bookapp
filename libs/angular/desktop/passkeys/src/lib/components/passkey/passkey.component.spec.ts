import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PasskeyProvidersMetadata } from '@bookapp/shared/interfaces';
import { passkey } from '@bookapp/testing/angular';

import { PasskeyComponent } from './passkey.component';

const mockProvidersMetadata: Record<string, PasskeyProvidersMetadata> = {
  'test-aaguid': {
    name: 'Test Provider',
    icon_light: '/assets/test-icon-light.png',
    icon_dark: '/assets/test-icon-dark.png',
  },
};

describe('PasskeyComponent', () => {
  let component: PasskeyComponent;
  let fixture: ComponentFixture<PasskeyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PasskeyComponent, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasskeyComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('passkey', { ...passkey, aaguid: 'test-aaguid' });
    fixture.componentRef.setInput('passkeyProvidersMetadata', mockProvidersMetadata);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('displaying passkey row', () => {
    it('should display passkey label', () => {
      const labelElement = fixture.debugElement.nativeElement.querySelectorAll('.header')[0];
      expect(labelElement.textContent.trim()).toBe(passkey.label);
    });

    it('should display provider name when metadata is available', () => {
      const providerElement = fixture.debugElement.nativeElement.querySelectorAll('.cell')[0];
      expect(providerElement.textContent.trim()).toBe('Test Provider');
    });

    it('should display provider icon when metadata is available', () => {
      const iconElement = fixture.debugElement.nativeElement.querySelector('.passkey-icon img');
      expect(iconElement).toBeTruthy();
      expect(iconElement.src).toContain('test-icon-light.png');
      expect(iconElement.alt).toBe('Test Provider');
    });

    it('should not display provider name when metadata is not available', () => {
      fixture.componentRef.setInput('passkeyProvidersMetadata', {});
      fixture.detectChanges();

      const providerElement = fixture.debugElement.nativeElement.querySelector(
        '.passkey-info:first-of-type .cell'
      );
      expect(providerElement).toBeFalsy();
    });

    it('should not display provider icon when metadata is not available', () => {
      fixture.componentRef.setInput('passkeyProvidersMetadata', {});
      fixture.detectChanges();

      const iconElement = fixture.debugElement.nativeElement.querySelector('.passkey-icon img');
      expect(iconElement).toBeFalsy();
    });
  });

  describe('editPasskey output', () => {
    beforeEach(() => {
      jest.spyOn(component.editPasskey, 'emit');
    });

    it('should emit editPasskey event when edit button is clicked', () => {
      const editButton = fixture.debugElement.nativeElement.querySelector('[data-test="edit"]');
      editButton.click();

      expect(component.editPasskey.emit).toHaveBeenCalledWith({
        ...passkey,
        aaguid: 'test-aaguid',
      });
    });
  });

  describe('deletePasskey output', () => {
    beforeEach(() => {
      jest.spyOn(component.deletePasskey, 'emit');
    });

    it('should emit deletePasskey event when delete button is clicked', () => {
      const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-test="delete"]');
      deleteButton.click();

      expect(component.deletePasskey.emit).toHaveBeenCalledWith({
        ...passkey,
        aaguid: 'test-aaguid',
      });
    });
  });
});
