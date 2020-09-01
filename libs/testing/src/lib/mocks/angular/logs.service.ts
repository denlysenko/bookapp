import { of } from 'rxjs';
import { book } from '../../test-data/book';
import { log } from '../../test-data/log';

export const MockAngularLogsService = {
  watchLastLogs: jest.fn().mockReturnValue(of({ data: { logs: { rows: [{ ...log, book }] } } })),
  watchAllLogs: jest.fn().mockReturnValue(
    of({
      data: { logs: { rows: [{ ...log, book }], count: 1 } },
    })
  ),
  refetch: jest.fn(),
  subscribeToNewLogs: jest.fn(),
};
