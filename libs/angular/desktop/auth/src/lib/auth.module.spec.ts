import { TestBed, waitForAsync } from '@angular/core/testing';
import { AuthModule } from './auth.module';

describe('AuthModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AuthModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(AuthModule).toBeDefined();
  });
});
