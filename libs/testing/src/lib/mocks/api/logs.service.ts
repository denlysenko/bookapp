import { log } from '../../test-data/log';

export const MockLogsService = {
  findAll: jest
    .fn()
    .mockImplementation(() => Promise.resolve({ count: 1, rows: [log] })),
  create: jest.fn().mockImplementation(() => Promise.resolve(log))
};
