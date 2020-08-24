import { async, TestBed } from '@angular/core/testing';
import { ProfileModule } from './profile.module';

describe('ProfileModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ProfileModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ProfileModule).toBeDefined();
  });
});
