import { async, TestBed } from '@angular/core/testing';
import { PreloaderModule } from './preloader.module';

describe('PreloaderModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PreloaderModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PreloaderModule).toBeDefined();
  });
});
