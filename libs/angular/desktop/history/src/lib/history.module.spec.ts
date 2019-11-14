import { async, TestBed } from '@angular/core/testing';
import { HistoryModule } from './history.module';

describe('HistoryModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HistoryModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HistoryModule).toBeDefined();
  });
});
