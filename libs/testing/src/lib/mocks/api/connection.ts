import { MockMongooseModel } from './model';

export const mockConnection = {
  model: jest.fn().mockReturnValue({
    ...MockMongooseModel
  }),
  close: jest.fn()
};
