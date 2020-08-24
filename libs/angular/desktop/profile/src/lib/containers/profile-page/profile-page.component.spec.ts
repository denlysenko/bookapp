import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { AuthService, ProfileService } from '@bookapp/angular/data-access';
import { MockAngularAuthService, MockFeedbackPlatformService, user } from '@bookapp/testing';

import { of } from 'rxjs';

import { ProfilePageComponent } from './profile-page.component';

const firstName = 'first name';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let profileService: ProfileService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePageComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
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
  }));

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
      component.updateProfile({ id: user._id, user: { firstName } });
      expect(profileService.update).toHaveBeenCalledWith(user._id, {
        firstName,
      });
    });

    it('should propagate error', (done) => {
      const error: any = { message: 'Error' };

      jest.spyOn(profileService, 'update').mockImplementationOnce(() => of({ errors: [error] }));

      let result: any;

      component.error$.subscribe((err) => {
        result = err;
        done();
      });

      component.updateProfile({ id: user._id, user: { firstName } });

      expect(result).toEqual(error);
    });
  });
});
