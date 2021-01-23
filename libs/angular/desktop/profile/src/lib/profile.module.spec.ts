import { TestBed, waitForAsync } from '@angular/core/testing';
import { ProfileModule } from './profile.module';

describe('ProfileModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ProfileModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(ProfileModule).toBeDefined();
  });
});
