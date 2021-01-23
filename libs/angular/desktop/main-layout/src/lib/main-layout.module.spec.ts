import { TestBed, waitForAsync } from '@angular/core/testing';
import { MainLayoutModule } from './main-layout.module';

describe('MainLayoutModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MainLayoutModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(MainLayoutModule).toBeDefined();
  });
});
