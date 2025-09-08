import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { EditPasskeyComponent } from './edit-passkey.component';

describe('EditPasskeyComponent', () => {
  let component: EditPasskeyComponent;
  let fixture: ComponentFixture<EditPasskeyComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<EditPasskeyComponent>>;
  const mockData = {
    passkey: {
      label: 'Test Passkey Label',
    },
  };

  beforeEach(() => {
    mockDialogRef = {
      close: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    TestBed.configureTestingModule({
      imports: [EditPasskeyComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockData,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPasskeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form with label from data', () => {
    const input = fixture.debugElement.query(By.css('input[formcontrolname=label]')).nativeElement;
    expect(input.value).toEqual('Test Passkey Label');
  });

  describe('Validations', () => {
    describe('label', () => {
      let input: HTMLInputElement;

      beforeEach(() => {
        input = fixture.debugElement.query(By.css('input[formcontrolname=label]')).nativeElement;
      });

      it('should show error message when label is invalid', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        component.form.controls['label'].markAsTouched();
        fixture.detectChanges();

        const errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.textContent.trim()).toBe('Label is required');
      });
    });
  });

  describe('cancel', () => {
    it('should close dialog with false when cancel button is clicked', () => {
      const cancelButton = fixture.debugElement.query(By.css('#cancel-btn'));
      cancelButton.nativeElement.click();
      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('save', () => {
    it('should call save() when save button is clicked', () => {
      jest.spyOn(component, 'save');
      const saveButton = fixture.debugElement.query(By.css('#save-btn'));
      saveButton.nativeElement.click();
      expect(component.save).toHaveBeenCalled();
    });
  });
});
