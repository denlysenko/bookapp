module.exports = {
  name: 'angular-mobile-auth',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/angular/mobile/auth',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
