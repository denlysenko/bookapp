module.exports = {
  name: 'api-e2e',
  preset: '../../jest.config.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/api-e2e',
  testEnvironment: 'node',
};
