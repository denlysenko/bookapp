import { async, TestBed } from '@angular/core/testing';

import { BuyBooksModule } from './buy-books.module';

describe('BuyBooksModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BuyBooksModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BuyBooksModule).toBeDefined();
  });
});
