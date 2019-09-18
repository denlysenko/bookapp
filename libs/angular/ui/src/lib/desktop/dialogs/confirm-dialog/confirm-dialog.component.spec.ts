import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { clickOnBtn } from '@bookapp/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';

const text = 'test text';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialog: MatDialogRef<ConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ConfirmDialogComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn()
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            text
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialog = TestBed.get(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have text', () => {
    const content = fixture.debugElement.query(By.directive(MatDialogContent))
      .nativeElement;
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
