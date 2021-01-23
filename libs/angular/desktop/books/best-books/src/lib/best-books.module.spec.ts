import { TestBed, waitForAsync } from '@angular/core/testing';
import { BestBooksModule } from './best-books.module';

describe('BestBooksModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BestBooksModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(BestBooksModule).toBeDefined();
  });
});
