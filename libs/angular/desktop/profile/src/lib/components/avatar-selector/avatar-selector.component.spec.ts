import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';

import { clickOnBtn, user } from '@bookapp/testing/angular';

import { of } from 'rxjs';

import { AvatarSelectorComponent } from './avatar-selector.component';

const avatarUrl = 'avatarUrl';

describe('AvatarSelectorComponent', () => {
  let component: AvatarSelectorComponent;
  let fixture: ComponentFixture<AvatarSelectorComponent>;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AvatarSelectorComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockImplementation(() => ({
              afterClosed: jest.fn().mockReturnValue(of(avatarUrl)),
            })),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarSelectorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();
    dialog = TestBed.inject(MatDialog);
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
        id: user.id,
        user: { avatar: avatarUrl },
      });
    });

    it('should not emit avatarSaved if no avatar', () => {
      dialog.open = jest.fn().mockImplementation(() => ({
        afterClosed: jest.fn().mockReturnValue(of(null)),
      }));

      clickOnBtn(fixture);
      expect(component.avatarSaved.emit).not.toHaveBeenCalled();
    });
  });
});
