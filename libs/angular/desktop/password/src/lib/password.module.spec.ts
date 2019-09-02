import { async, TestBed } from '@angular/core/testing';
import { PasswordModule } from './password.module';

describe('PasswordModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PasswordModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PasswordModule).toBeDefined();
  });
});
