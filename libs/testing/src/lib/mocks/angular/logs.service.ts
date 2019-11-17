import { of } from 'rxjs';
import { book } from '../../test-data/book';
import { log } from '../../test-data/log';

export const MockAngularLogsService = {
  getLastLogs: jest.fn().mockReturnValue({
    valueChanges: of({ data: { logs: { rows: [{ ...log, book }] } } }),
    subscribeToMore: jest.fn()
  }),
  getLogs: jest.fn().mockReturnValue({
    valueChanges: of({
      data: { logs: { rows: [{ ...log, book }], count: 1 } }
    }),
    subscribeToMore: jest.fn(),
    refetch: jest.fn()
  })
};
