export const MockMongooseModel = {
  countDocuments: jest.fn(() => MockMongooseModel),
  find: jest.fn(() => MockMongooseModel),
  findById: jest.fn(() => MockMongooseModel),
  findOne: jest.fn(() => MockMongooseModel),
  skip: jest.fn(() => MockMongooseModel),
  limit: jest.fn(() => MockMongooseModel),
  sort: jest.fn(() => MockMongooseModel),
  exec: jest.fn(),
  save: jest.fn(),
  remove: jest.fn()
};

export class MockModel {
  constructor() {
    return MockMongooseModel;
  }
}

Object.assign(MockModel, MockMongooseModel);
