import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { AuthService, ProfileService } from '@bookapp/angular/data-access';
import {
  MockAngularAuthService,
  MockFeedbackPlatformService,
  user,
} from '@bookapp/testing/angular';

import { of } from 'rxjs';

import { ProfilePageComponent } from './profile-page.component';

const firstName = 'first name';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let profileService: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        {
          provide: AuthService,
          useValue: MockAngularAuthService,
        },
        {
          provide: FeedbackPlatformService,
          useValue: MockFeedbackPlatformService,
        },
        {
          provide: ProfileService,
          useValue: {
            update: jest.fn().mockImplementation(() => of({ data: { updateProfile: user } })),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    profileService = TestBed.inject(ProfileService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateProfile()', () => {
    it('should update profile', () => {
      component.updateProfile({ id: user.id, user: { firstName } });
      expect(profileService.update).toHaveBeenCalledWith(user.id, {
        firstName,
      });
    });

    it('should propagate error', fakeAsync(() => {
      const error = { message: 'Error' };

      jest.spyOn(profileService, 'update').mockImplementationOnce(() => of({ errors: [error] }));

      component.updateProfile({ id: user.id, user: { firstName } });
      tick();

      expect(component.error()).toEqual(error);
    }));
  });
});
