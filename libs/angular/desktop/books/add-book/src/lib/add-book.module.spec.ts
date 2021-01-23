import { TestBed, waitForAsync } from '@angular/core/testing';

import { AddBookModule } from './add-book.module';

describe('AddBookModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AddBookModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(AddBookModule).toBeDefined();
  });
});
