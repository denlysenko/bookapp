import { async, TestBed } from '@angular/core/testing';
import { BestBooksModule } from './best-books.module';

describe('BestBooksModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BestBooksModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BestBooksModule).toBeDefined();
  });
});
