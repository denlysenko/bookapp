import { async, TestBed } from '@angular/core/testing';
import { MainLayoutModule } from './main-layout.module';

describe('MainLayoutModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MainLayoutModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(MainLayoutModule).toBeDefined();
  });
});
