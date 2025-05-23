import { DateToPeriodPipe } from './date-to-period.pipe';

const timestamp = 1573381988808;

Date.now = jest.fn(() => timestamp + 24 * 60 * 60 * 1000);

describe('DateToPeriodPipe', () => {
  let pipe: DateToPeriodPipe;

  beforeEach(() => {
    pipe = new DateToPeriodPipe();
  });

  it('should create()', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform', () => {
    expect(pipe.transform(timestamp)).toEqual('1 days ago');
  });
});
