import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

import { clickOnBtn } from '@bookapp/testing/angular';

import { ConfirmDialogComponent } from './confirm-dialog.component';

const text = 'test text';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialog: MatDialogRef<ConfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            text,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialog = TestBed.inject(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have text', () => {
    const content = fixture.debugElement.query(By.directive(MatDialogContent)).nativeElement;
    expect(content.textContent).toEqual(text);
  });

  it('should close with true', () => {
    clickOnBtn(fixture, '#confirm-btn');
    expect(dialog.close).toHaveBeenCalledWith(true);
  });

  it('should close with false', () => {
    clickOnBtn(fixture, '#cancel-btn');
    expect(dialog.close).toHaveBeenCalledWith(false);
  });
});
