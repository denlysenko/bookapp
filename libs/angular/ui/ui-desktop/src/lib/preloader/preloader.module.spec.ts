import { TestBed, waitForAsync } from '@angular/core/testing';
import { PreloaderModule } from './preloader.module';

describe('PreloaderModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PreloaderModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(PreloaderModule).toBeDefined();
  });
});
