import { TestBed, waitForAsync } from '@angular/core/testing';

import { BuyBooksModule } from './buy-books.module';

describe('BuyBooksModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BuyBooksModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(BuyBooksModule).toBeDefined();
  });
});
