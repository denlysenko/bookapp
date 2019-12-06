import { DateToPeriodPipe } from './date-to-period.pipe';

describe('DateToPeriodPipe', () => {
  let pipe: DateToPeriodPipe;

  beforeEach(() => {
    pipe = new DateToPeriodPipe();
  });

  it('should create()', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform', () => {
    expect(pipe.transform('1573381988808')).toEqual('26 days ago');
  });
});
