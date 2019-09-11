import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { user } from '@bookapp/testing';

import { of } from 'rxjs';

import { AvatarSelectorComponent } from './avatar-selector.component';

const avatarUrl = 'avatarUrl';

const clickOnBtn = (fixture: ComponentFixture<AvatarSelectorComponent>) => {
  const btn = fixture.debugElement.query(By.css('button')).nativeElement;
  btn.click();
  fixture.detectChanges();
};

describe('AvatarSelectorComponent', () => {
  let component: AvatarSelectorComponent;
  let fixture: ComponentFixture<AvatarSelectorComponent>;
  let dialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarSelectorComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockImplementation(() => ({
              afterClosed: jest.fn().mockReturnValue(of(avatarUrl))
            }))
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarSelectorComponent);
    component = fixture.componentInstance;
    component.user = user;
    fixture.detectChanges();
    dialog = TestBed.get(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showSelector()', () => {
    beforeEach(() => {
      jest.spyOn(component.avatarSaved, 'emit');
    });
    it('should open dialog', () => {
      clickOnBtn(fixture);
      expect(dialog.open).toHaveBeenCalled();
    });

    it('should emit avatarSaved event', () => {
      clickOnBtn(fixture);
      expect(component.avatarSaved.emit).toHaveBeenCalledWith({
        id: user._id,
        user: { avatar: avatarUrl }
      });
    });

    it('should not emit avatarSaved if no avatar', () => {
      dialog.open = jest.fn().mockImplementation(() => ({
        afterClosed: jest.fn().mockReturnValue(of(null))
      }));

      clickOnBtn(fixture);
      expect(component.avatarSaved.emit).not.toHaveBeenCalled();
    });
  });
});
