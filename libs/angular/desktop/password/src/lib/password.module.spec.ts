import { TestBed, waitForAsync } from '@angular/core/testing';
import { PasswordModule } from './password.module';

describe('PasswordModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PasswordModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(PasswordModule).toBeDefined();
  });
});
