export const MockMongooseModel = {
  _id: '_id',
  countDocuments: jest.fn(() => MockMongooseModel),
  find: jest.fn(() => MockMongooseModel),
  findById: jest.fn(() => MockMongooseModel),
  findOne: jest.fn(() => MockMongooseModel),
  findOneAndUpdate: jest.fn(() => MockMongooseModel),
  skip: jest.fn(() => MockMongooseModel),
  limit: jest.fn(() => MockMongooseModel),
  sort: jest.fn(() => MockMongooseModel),
  exec: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  deleteOne: jest.fn(() => MockMongooseModel),
  deleteMany: jest.fn(() => MockMongooseModel),
  create: jest.fn().mockResolvedValue(true),
  updateOne: jest.fn(() => MockMongooseModel),
  populate: jest.fn(() => MockMongooseModel),
};

export class MockModel {
  constructor() {
    return MockMongooseModel;
  }
}

Object.assign(MockModel, MockMongooseModel);
